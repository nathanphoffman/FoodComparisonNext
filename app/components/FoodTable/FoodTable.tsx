'use client';

import { useState, useRef, useEffect } from 'react';
import { Table } from '../Table/Table';
import { Row } from '../Table/Row';
import {
  NameCell,
  NutritionScoreCell,
  EmissionsCell,
  LandUseCell,
  IntelligenceCell,
  WaterCell,
  DummyCell,
} from './FoodTableFields';
import type { FoodEthics, FoodWeights } from './FoodTableTypes';
import { FoodTableSliders } from './FoodTableSliders';
import { computeDivisor, getUnitLabel, effectiveWater } from './FoodTableCalculations';

export type { FoodEthics };

type SortKey = 'name' | 'nutritionScore' | 'emissions' | 'landUse' | 'intelligence' | 'water';
type ColumnKey = SortKey | 'dummy';

const COLUMN_CONFIG: { key: ColumnKey; label: string; sortKey?: SortKey; defaultVisible: boolean }[] = [
  { key: 'name',           label: 'Food',               sortKey: 'name',           defaultVisible: true  },
  { key: 'nutritionScore', label: 'Nutrition Score',     sortKey: 'nutritionScore', defaultVisible: true  },
  { key: 'emissions',      label: 'CO₂e (kg / kg)',      sortKey: 'emissions',      defaultVisible: true  },
  { key: 'landUse',        label: 'Land Use (m² / kg)',  sortKey: 'landUse',        defaultVisible: true  },
  { key: 'intelligence',   label: 'Intelligence',         sortKey: 'intelligence',   defaultVisible: true  },
  { key: 'water',          label: 'Water (L / kg)',       sortKey: 'water',          defaultVisible: true  },
  { key: 'dummy',          label: 'Test Column',          sortKey: undefined,        defaultVisible: false },
];

export function FoodTable({ data }: { data?: FoodEthics[] }) {
  const [sortKey, setSortKey]        = useState<SortKey | null>(null);
  const [sortDir, setSortDir]        = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisible] = useState<Set<ColumnKey>>(
    () => new Set(COLUMN_CONFIG.filter(c => c.defaultVisible).map(c => c.key))
  );
  const [showToggle, setShowToggle]  = useState(false);
  const [weights, setWeights]        = useState<FoodWeights>({ calories: 34, protein: 33, mass: 33 });
  const [greenWaterWeight, setGreenWaterWeight] = useState(100);
  const toggleRef                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (toggleRef.current && !toggleRef.current.contains(e.target as Node)) {
        setShowToggle(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function columnSortProps(key: SortKey) {
    return { sorted: sortKey === key ? sortDir : undefined, onSort: () => handleSort(key) };
  }

  function toggleColumn(key: ColumnKey) {
    setVisible(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const rows = data ?? [];

  const WEIGHTED_SORT_KEYS = new Set<SortKey>(['emissions', 'landUse', 'intelligence', 'water']);

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const useWeight = WEIGHTED_SORT_KEYS.has(sortKey);
        const rawA = sortKey === 'water' ? effectiveWater(a, greenWaterWeight) : a[sortKey] as number | string | null;
        const rawB = sortKey === 'water' ? effectiveWater(b, greenWaterWeight) : b[sortKey] as number | string | null;
        const va = useWeight && typeof rawA === 'number' ? rawA / computeDivisor(a, weights) : rawA;
        const vb = useWeight && typeof rawB === 'number' ? rawB / computeDivisor(b, weights) : rawB;
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        if (va === vb) return 0;
        const cmp = va < vb ? -1 : 1;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : rows;

  const activeCols = COLUMN_CONFIG.filter(c => visibleColumns.has(c.key));

  const unit = getUnitLabel(weights);
  const DYNAMIC_LABELS: Partial<Record<ColumnKey, string>> = {
    emissions:    `CO₂e (kg / ${unit})`,
    landUse:      `Land Use (m² / ${unit})`,
    intelligence: `Intelligence / ${unit}`,
    water:        `Water (L / ${unit})`,
  };

  const headers = activeCols.map(c => ({
    label: DYNAMIC_LABELS[c.key] ?? c.label,
    ...(c.sortKey ? columnSortProps(c.sortKey) : {}),
  }));

  return (
    <div className="mt-6">
      <FoodTableSliders onChange={setWeights} onGreenWaterChange={setGreenWaterWeight} />
      <div className="flex justify-end mb-2" ref={toggleRef}>
        <div className="relative">
          <button
            onClick={() => setShowToggle(v => !v)}
            className="text-sm text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded px-3 py-1 flex items-center gap-1"
          >
            Columns <span className="text-xs">{showToggle ? '▴' : '▾'}</span>
          </button>
          {showToggle && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded shadow-md p-3 space-y-2 z-10 min-w-[160px]">
              {COLUMN_CONFIG.filter(c => c.key !== 'name').map(col => (
                <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-neutral-700"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <Table headers={headers}>
        {sorted.map((food) => {
          const d = computeDivisor(food, weights);
          return (
            <Row key={food.slug}>
              {activeCols.map(col => {
                switch (col.key) {
                  case 'name':           return <NameCell           key="name"           name={food.name} slug={food.slug} />;
                  case 'nutritionScore': return <NutritionScoreCell key="nutritionScore" score={food.nutritionScore} detail={food.nutritionDetail} />;
                  case 'emissions':      return <EmissionsCell      key="emissions"      value={food.emissions != null ? food.emissions / d : null} breakdown={food.emissionsBreakdown} divisor={d} />;
                  case 'landUse':        return <LandUseCell        key="landUse"        value={food.landUse != null ? food.landUse / d : null} detail={food.landUseDetail} />;
                  case 'intelligence':   return <IntelligenceCell   key="intelligence"   value={food.intelligence != null ? food.intelligence / d : null} detail={food.intelligenceDetail} />;
                  case 'water': {
                    const ew = effectiveWater(food, greenWaterWeight);
                    return <WaterCell key="water" value={ew != null ? ew / d : null} detail={food.waterDetail} referenceTotal={food.water} />;
                  }
                  case 'dummy':          return <DummyCell          key="dummy" />;
                }
              })}
            </Row>
          );
        })}
      </Table>
    </div>
  );
}
