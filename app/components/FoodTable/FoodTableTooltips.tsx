import type { EmissionsBreakdown, IntelligenceDetail, LandUseDetail, NutritionDetail } from './FoodTableTypes';
import { formatNeurons, nutritionScale } from './FoodTableCalculations';

const MILLIGRAMS_PER_GRAM = 1000;
const PERCENT_MULTIPLIER  = 100;

export function EmissionsTooltip({ breakdown }: { breakdown: EmissionsBreakdown }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Emissions breakdown</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CO₂</span><span>{breakdown.co2.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CH₄ (as CO₂e)</span><span>{breakdown.ch4.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">N₂O (as CO₂e)</span><span>{breakdown.n2o.toFixed(1)} kg</span></div>
    </div>
  );
}

export function NutritionTooltip({ detail }: { detail: NutritionDetail }) {
  const scale = nutritionScale(detail.calories);
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Nutrition (per 100 cal)</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Protein</span><span>{(detail.protein * scale).toFixed(1)} g</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Fiber</span><span>{(detail.fiber * scale).toFixed(1)} g</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Sat. fat</span><span>{(detail.saturatedFat * scale).toFixed(1)} g</span></div>
      {detail.transFat != null && <div className="flex justify-between gap-6"><span className="text-neutral-400">Trans fat</span><span>{(detail.transFat * scale).toFixed(1)} g</span></div>}
      {detail.carbs != null && <div className="flex justify-between gap-6"><span className="text-neutral-400">Carbs</span><span>{(detail.carbs * scale).toFixed(1)} g</span></div>}
      {detail.sugar != null && <div className="flex justify-between gap-6"><span className="text-neutral-400">Sugar</span><span>{(detail.sugar * scale).toFixed(1)} g</span></div>}
      {detail.sodium != null && <div className="flex justify-between gap-6"><span className="text-neutral-400">Sodium</span><span>{(detail.sodium * scale * MILLIGRAMS_PER_GRAM).toFixed(0)} mg</span></div>}
      {detail.cholesterol != null && <div className="flex justify-between gap-6"><span className="text-neutral-400">Cholesterol</span><span>{(detail.cholesterol * scale * MILLIGRAMS_PER_GRAM).toFixed(0)} mg</span></div>}
    </div>
  );
}

export function LandUseTooltip({ detail }: { detail: LandUseDetail }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Land use</div>
      {detail.type === 'plant' && detail.yieldKilogramsPerHectare != null && (
        <div className="flex justify-between gap-6"><span className="text-neutral-400">Crop yield</span><span>{detail.yieldKilogramsPerHectare.toLocaleString()} kg/ha</span></div>
      )}
      {detail.type === 'animal' && detail.pastureHectaresPerKilogram != null && (
        <div className="flex justify-between gap-6"><span className="text-neutral-400">Pasture</span><span>{detail.pastureHectaresPerKilogram.toFixed(3)} ha/kg</span></div>
      )}
    </div>
  );
}

export function IntelligenceTooltip({ detail }: { detail: IntelligenceDetail }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Intelligence score</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Neuron count</span><span>{formatNeurons(detail.neuronCount)}</span></div>
      {detail.weightKg != null && (
        <div className="flex justify-between gap-6"><span className="text-neutral-400">Animal weight</span><span>{detail.weightKg} kg</span></div>
      )}
      {detail.yieldFraction != null && (
        <div className="flex justify-between gap-6"><span className="text-neutral-400">Yield fraction</span><span>{(detail.yieldFraction * PERCENT_MULTIPLIER).toFixed(0)}%</span></div>
      )}
      <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">^1.5 scaling applied to reflect neural interconnectivity</div>
    </div>
  );
}
