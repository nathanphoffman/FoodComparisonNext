import type { EmissionsBreakdown, IntelligenceDetail, LandUseDetail, NutritionDetail } from './FoodTableTypes';
import { formatNeurons, nutritionScale } from './FoodTableCalculations';
import { Tooltip, TooltipSection, TooltipRow } from '../Table/Tooltip';

const MILLIGRAMS_PER_GRAM = 1000;
const PERCENT_MULTIPLIER  = 100;

export function EmissionsTooltip({ breakdown, children }: { breakdown: EmissionsBreakdown; children: React.ReactNode }) {
  return (
    <Tooltip content={
      <TooltipSection title="Emissions breakdown">
        <TooltipRow label="CO₂" value={`${breakdown.co2.toFixed(1)} kg`} />
        <TooltipRow label="CH₄ (as CO₂e)" value={`${breakdown.ch4.toFixed(1)} kg`} />
        <TooltipRow label="N₂O (as CO₂e)" value={`${breakdown.n2o.toFixed(1)} kg`} />
        {breakdown.feedEmissions != null && (
          <TooltipRow label="Feed crops" value={`${breakdown.feedEmissions.toFixed(1)} kg CO₂e`} />
        )}
      </TooltipSection>
    }>
      {children}
    </Tooltip>
  );
}

export function NutritionTooltip({ detail, children }: { detail: NutritionDetail; children: React.ReactNode }) {
  const scale = nutritionScale(detail.calories);
  return (
    <Tooltip content={
      <TooltipSection title="Nutrition (per 100 cal)">
        <TooltipRow label="Total fat" value={`${(detail.fat * scale).toFixed(1)} g`} />
        <TooltipRow label="Sat. fat" value={`${(detail.saturatedFat * scale).toFixed(1)} g`} />
        {detail.transFat != null && <TooltipRow label="Trans fat" value={`${(detail.transFat * scale).toFixed(1)} g`} />}
        {detail.cholesterol != null && <TooltipRow label="Cholesterol" value={`${(detail.cholesterol * scale * MILLIGRAMS_PER_GRAM).toFixed(0)} mg`} />}
        {detail.sodium != null && <TooltipRow label="Sodium" value={`${(detail.sodium * scale * MILLIGRAMS_PER_GRAM).toFixed(0)} mg`} />}
        {detail.carbs != null && <TooltipRow label="Total carbs" value={`${(detail.carbs * scale).toFixed(1)} g`} />}
        <TooltipRow label="Fiber" value={`${(detail.fiber * scale).toFixed(1)} g`} />
        {detail.sugar != null && <TooltipRow label="Sugar" value={`${(detail.sugar * scale).toFixed(1)} g`} />}
        <TooltipRow label="Protein" value={`${(detail.protein * scale).toFixed(1)} g`} />
      </TooltipSection>
    }>
      {children}
    </Tooltip>
  );
}

export function LandUseTooltip({ detail, children }: { detail: LandUseDetail; children: React.ReactNode }) {
  return (
    <Tooltip content={
      <TooltipSection title="Land use">
        {detail.type === 'plant' && detail.yieldKilogramsPerHectare != null && (
          <TooltipRow label="Crop yield" value={`${detail.yieldKilogramsPerHectare.toLocaleString()} kg/ha`} />
        )}
        {detail.type === 'animal' && detail.pastureHectaresPerKilogram != null && (
          <TooltipRow label="Pasture" value={`${detail.pastureHectaresPerKilogram.toFixed(3)} ha/kg`} />
        )}
      </TooltipSection>
    }>
      {children}
    </Tooltip>
  );
}

export function IntelligenceTooltip({ detail, children }: { detail: IntelligenceDetail; children: React.ReactNode }) {
  return (
    <Tooltip content={
      <TooltipSection title="Intelligence score">
        <TooltipRow label="Neuron count" value={formatNeurons(detail.neuronCount)} />
        {detail.weightKg != null && <TooltipRow label="Animal weight" value={`${detail.weightKg} kg`} />}
        {detail.yieldFraction != null && <TooltipRow label="Yield fraction" value={`${(detail.yieldFraction * PERCENT_MULTIPLIER).toFixed(0)}%`} />}
        <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">^1.5 scaling applied to reflect neural interconnectivity</div>
      </TooltipSection>
    }>
      {children}
    </Tooltip>
  );
}
