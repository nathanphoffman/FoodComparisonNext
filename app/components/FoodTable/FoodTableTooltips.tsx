import type { EcoDestructionDetail, EmissionsBreakdown, IntelligenceDetail, LandUseDetail, NutritionDetail, WaterDetail } from './FoodTableTypes';
import { formatIntelligenceValue, formatNeurons, nutritionScale } from './FoodTableCalculations';
import { Tooltip, TooltipSection, TooltipRow } from '../Table/Tooltip';

const MILLIGRAMS_PER_GRAM = 1000;
const PERCENT_MULTIPLIER  = 100;

export function EmissionsTooltip({ breakdown, divisor, children }: { breakdown: EmissionsBreakdown; divisor: number; children: React.ReactNode }) {
  return (
    <Tooltip content={
      <TooltipSection title="Emissions breakdown">
        <TooltipRow label="CO₂" value={`${(breakdown.co2 / divisor).toFixed(1)} kg CO₂e`} />
        <TooltipRow label="CH₄ (as CO₂e)" value={`${(breakdown.ch4 / divisor).toFixed(1)} kg CO₂e`} />
        <TooltipRow label="N₂O (as CO₂e)" value={`${(breakdown.n2o / divisor).toFixed(1)} kg CO₂e`} />
        {breakdown.feedEmissions != null && (
          <TooltipRow label="Feed crops" value={`${(breakdown.feedEmissions / divisor).toFixed(1)} kg CO₂e`} />
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
        {detail.cholesterol != null && <TooltipRow label="Cholesterol" value={`${(detail.cholesterol * scale).toFixed(0)} mg`} />}
        {detail.sodium != null && <TooltipRow label="Sodium" value={`${(detail.sodium * scale).toFixed(0)} mg`} />}
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

export function WaterTooltip({ detail, referenceTotal, children }: { detail: WaterDetail; referenceTotal: number | null; children: React.ReactNode }) {
  return (
    <Tooltip content={
      <TooltipSection title="Water breakdown">
        {detail.blue  != null && <TooltipRow label="Blue (irrigation)"  value={`${detail.blue.toLocaleString()} L/kg`} />}
        {detail.green != null && <TooltipRow label="Green (rain)"       value={`${detail.green.toLocaleString()} L/kg`} />}
        {detail.grey  != null && <TooltipRow label="Grey (pollution)"   value={`${detail.grey.toLocaleString()} L/kg`} />}
        {referenceTotal != null && (
          <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">
            Reference total (independent source): {referenceTotal.toLocaleString()} L/kg
          </div>
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

export function EcoDestructionTooltip({ detail, children }: { detail: EcoDestructionDetail; children: React.ReactNode }) {
  const hasPlant   = detail.insectScore > 0 || detail.beeScore > 0 || detail.wormScore > 0 || detail.deforestationScore > 0;
  const hasFeed    = detail.feedInsectScore > 0 || detail.feedBeeScore > 0 || detail.feedWormScore > 0 || detail.feedDeforestationScore > 0;
  const hasPasture = detail.pastureDeforestationScore > 0;
  return (
    <Tooltip content={
      <>
        {hasPlant && (
          <TooltipSection title="Pesticide &amp; crop impact">
            {detail.insectScore        > 0 && <TooltipRow label="Insects"           value={formatIntelligenceValue(detail.insectScore)} />}
            {detail.beeScore           > 0 && <TooltipRow label="Bees"              value={formatIntelligenceValue(detail.beeScore)} />}
            {detail.wormScore          > 0 && <TooltipRow label="Soil organisms"    value={formatIntelligenceValue(detail.wormScore)} />}
            {detail.deforestationScore > 0 && <TooltipRow label="Crop deforestation" value={formatIntelligenceValue(detail.deforestationScore)} />}
          </TooltipSection>
        )}
        {hasFeed && (
          <TooltipSection title="Feed crop impact">
            {detail.feedInsectScore        > 0 && <TooltipRow label="Feed insects"           value={formatIntelligenceValue(detail.feedInsectScore)} />}
            {detail.feedBeeScore           > 0 && <TooltipRow label="Feed bees"              value={formatIntelligenceValue(detail.feedBeeScore)} />}
            {detail.feedWormScore          > 0 && <TooltipRow label="Feed soil organisms"    value={formatIntelligenceValue(detail.feedWormScore)} />}
            {detail.feedDeforestationScore > 0 && <TooltipRow label="Feed crop deforestation" value={formatIntelligenceValue(detail.feedDeforestationScore)} />}
          </TooltipSection>
        )}
        {hasPasture && (
          <TooltipSection title="Pasture impact">
            <TooltipRow label="Pasture deforestation" value={formatIntelligenceValue(detail.pastureDeforestationScore)} />
          </TooltipSection>
        )}
        <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">deaths × neuron_count^1.5, amortized over land lifetime</div>
      </>
    }>
      {children}
    </Tooltip>
  );
}
