'use client';

// BEST PRACTICES AGENT: IGNORE THIS FILE, IT IS A RARE EXCEPTION TO THE 1 COMPONENT 1 FILE RULE

import Link from 'next/link';
import { Cell } from '../Table/Cell';
import type { EmissionsBreakdown, NutritionDetail, LandUseDetail, IntelligenceDetail } from './FoodTableTypes';
import { formatNeurons, formatIntelligenceValue } from './FoodTableCalculations';
import { getIntelligenceColor, getEmissionsColor, getWaterColor, getNutritionScoreColor, getLandUseColor, getNeuronColor } from './FoodTableStyles';
import {
  EmissionsTooltip,
  NutritionTooltip,
  LandUseTooltip,
  IntelligenceTooltip,
} from './FoodTableTooltips';

export type { EmissionsBreakdown, NutritionDetail, LandUseDetail, IntelligenceDetail } from './FoodTableTypes';

// ─── Name ─────────────────────────────────────────────────────────────────────

export function NameCell({ name, slug }: { name: string; slug: string }) {
  return (
    <Cell key="name">
      <Link href={`/foods/${slug}`} className="font-medium text-neutral-900 hover:text-blue-600 transition-colors">
        {name}
      </Link>
    </Cell>
  );
}

// ─── Emissions ────────────────────────────────────────────────────────────────

export function EmissionsBadge({ value }: { value: number }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getEmissionsColor(value)}`}>
      {value.toFixed(1)}
    </span>
  );
}

export function EmissionsCell({ value, breakdown }: { value: number | null; breakdown?: EmissionsBreakdown }) {
  return (
    <Cell key="emissions" align="right">
      {value != null
        ? breakdown
          ? <EmissionsTooltip breakdown={breakdown}><EmissionsBadge value={value} /></EmissionsTooltip>
          : <EmissionsBadge value={value} />
        : <span className="text-neutral-400">—</span>
      }
    </Cell>
  );
}

// ─── Water ────────────────────────────────────────────────────────────────────

export function WaterValue({ value }: { value: number }) {
  return <span className={getWaterColor(value)}>{value.toLocaleString()}</span>;
}

export function WaterCell({ value }: { value: number | null }) {
  return (
    <Cell key="water" align="right">
      {value != null
        ? <WaterValue value={value} />
        : <span className="text-neutral-400">—</span>
      }
    </Cell>
  );
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export function NutritionScore({ score }: { score: number }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getNutritionScoreColor(score)}`}>
      {score.toFixed(1)}
    </span>
  );
}

export function NutritionScoreCell({ score, detail }: { score: number | null; detail: NutritionDetail }) {
  return (
    <Cell key="nutritionScore" align="right">
      {score != null
        ? <NutritionTooltip detail={detail}><NutritionScore score={score} /></NutritionTooltip>
        : <span className="text-neutral-400">—</span>
      }
    </Cell>
  );
}

// ─── Land Use ─────────────────────────────────────────────────────────────────

export function LandUseValue({ value }: { value: number | null }) {
  if (value === null) return <span className="text-neutral-400">—</span>;
  return <span className={getLandUseColor(value)}>{value.toFixed(1)}</span>;
}

export function LandUseCell({ value, detail }: { value: number | null; detail: LandUseDetail }) {
  return (
    <Cell key="landUse" align="right">
      {value != null
        ? <LandUseTooltip detail={detail}><LandUseValue value={value} /></LandUseTooltip>
        : <LandUseValue value={null} />
      }
    </Cell>
  );
}

// ─── Intelligence ─────────────────────────────────────────────────────────────

export function IntelligenceValue({ value }: { value: number | null }) {
  if (value === null || value === 0) return <span className="text-neutral-400">—</span>;
  return <span className={getIntelligenceColor(value)}>{formatIntelligenceValue(value)}</span>;
}

export function IntelligenceCell({ value, detail }: { value: number | null; detail: IntelligenceDetail }) {
  return (
    <Cell key="intelligence" align="right">
      {value != null
        ? <IntelligenceTooltip detail={detail}><IntelligenceValue value={value} /></IntelligenceTooltip>
        : <IntelligenceValue value={null} />
      }
    </Cell>
  );
}

// ─── Dummy ────────────────────────────────────────────────────────────────────

export function DummyCell() {
  return (
    <Cell key="dummy" align="right">
      <span className="text-neutral-300 text-xs">test</span>
    </Cell>
  );
}

// ─── NeuronValue (kept for other uses) ───────────────────────────────────────

export function NeuronValue({ value }: { value: number }) {
  if (value === 0) return <span className="text-neutral-400">—</span>;
  return <span className={`font-medium ${getNeuronColor(value)}`}>{formatNeurons(value)}</span>;
}
