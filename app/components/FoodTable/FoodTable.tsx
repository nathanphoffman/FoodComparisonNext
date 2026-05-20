'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Table } from '../Table/Table';
import { Row } from '../Table/Row';
import { Cell } from '../Table/Cell';
import { Tooltip } from '../Table/Tooltip';
import {
  EmissionsBadge, EmissionsTooltip,
  NutritionScore, NutritionTooltip,
  WaterValue,
  LandUseValue, LandUseTooltip,
  IntelligenceValue, IntelligenceTooltip,
  type EmissionsBreakdown,
  type NutritionDetail,
  type LandUseDetail,
  type IntelligenceDetail,
} from './FoodTableFields';

export type FoodEthics = {
  name:               string;
  slug:               string;
  nutritionScore:     number | null;
  nutritionDetail:    NutritionDetail;
  emissions:          number;
  emissionsBreakdown?: EmissionsBreakdown;
  landUse:            number | null;
  landUseDetail:      LandUseDetail;
  intelligence:       number | null;
  intelligenceDetail: IntelligenceDetail;
  water:              number;
};

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

const mockFoods: FoodEthics[] = [
  {
    name: 'Beef', slug: 'beef',
    nutritionScore: 4.8, nutritionDetail: { protein: 26, fiber: 0, saturatedFat: 7, calories: 250 },
    emissions: 27.0, emissionsBreakdown: { co2: 3.0, ch4: 20.0, n2o: 4.0 },
    landUse: 164, landUseDetail: { type: 'animal', yieldKilogramsPerHectare: null, pastureHectaresPerKilogram: 0.0164 },
    intelligence: 6.88e13, intelligenceDetail: { neuronCount: 71_000_000_000, weightKg: 500, yieldFraction: 0.55 },
    water: 15415,
  },
  {
    name: 'Broccoli', slug: 'broccoli',
    nutritionScore: 23.5, nutritionDetail: { protein: 2.8, fiber: 2.6, saturatedFat: 0, calories: 34 },
    emissions: 0.4, emissionsBreakdown: { co2: 0.2, ch4: 0.0, n2o: 0.2 },
    landUse: 0.5, landUseDetail: { type: 'plant', yieldKilogramsPerHectare: 20000, pastureHectaresPerKilogram: null },
    intelligence: null, intelligenceDetail: { neuronCount: 0, weightKg: null, yieldFraction: null },
    water: 285,
  },
];

export function FoodTable({ data = mockFoods }: { data?: FoodEthics[] }) {
  const [sortKey, setSortKey]         = useState<SortKey | null>(null);
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisible]  = useState<Set<ColumnKey>>(
    () => new Set(COLUMN_CONFIG.filter(c => c.defaultVisible).map(c => c.key))
  );
  const [showToggle, setShowToggle]   = useState(false);
  const toggleRef                     = useRef<HTMLDivElement>(null);

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

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const va = a[sortKey] as number | string | null;
        const vb = b[sortKey] as number | string | null;
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        if (va === vb) return 0;
        const cmp = va < vb ? -1 : 1;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  function renderCell(key: ColumnKey, food: FoodEthics) {
    switch (key) {
      case 'name':
        return (
          <Cell key="name">
            <Link href={`/foods/${food.slug}`} className="font-medium text-neutral-900 hover:text-blue-600 transition-colors">
              {food.name}
            </Link>
          </Cell>
        );
      case 'nutritionScore':
        return (
          <Cell key="nutritionScore" align="right">
            {food.nutritionScore != null
              ? <Tooltip content={<NutritionTooltip detail={food.nutritionDetail} />}><NutritionScore score={food.nutritionScore} /></Tooltip>
              : <span className="text-neutral-400">—</span>
            }
          </Cell>
        );
      case 'emissions':
        return (
          <Cell key="emissions" align="right">
            {food.emissionsBreakdown
              ? <Tooltip content={<EmissionsTooltip breakdown={food.emissionsBreakdown} />}><EmissionsBadge value={food.emissions} /></Tooltip>
              : <EmissionsBadge value={food.emissions} />
            }
          </Cell>
        );
      case 'landUse':
        return (
          <Cell key="landUse" align="right">
            {food.landUse != null
              ? <Tooltip content={<LandUseTooltip detail={food.landUseDetail} />}><LandUseValue value={food.landUse} /></Tooltip>
              : <LandUseValue value={null} />
            }
          </Cell>
        );
      case 'intelligence':
        return (
          <Cell key="intelligence" align="right">
            {food.intelligence != null
              ? <Tooltip content={<IntelligenceTooltip detail={food.intelligenceDetail} />}><IntelligenceValue value={food.intelligence} /></Tooltip>
              : <IntelligenceValue value={null} />
            }
          </Cell>
        );
      case 'water':
        return (
          <Cell key="water" align="right">
            <WaterValue value={food.water} />
          </Cell>
        );
      case 'dummy':
        return (
          <Cell key="dummy" align="right">
            <span className="text-neutral-300 text-xs">test</span>
          </Cell>
        );
    }
  }

  const activeCols = COLUMN_CONFIG.filter(c => visibleColumns.has(c.key));

  const headers = activeCols.map(c => ({
    label: c.label,
    ...(c.sortKey ? columnSortProps(c.sortKey) : {}),
  }));

  return (
    <div className="mt-6">
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
        {sorted.map((food, i) => (
          <Row key={i}>
            {activeCols.map(col => renderCell(col.key, food))}
          </Row>
        ))}
      </Table>
    </div>
  );
}
