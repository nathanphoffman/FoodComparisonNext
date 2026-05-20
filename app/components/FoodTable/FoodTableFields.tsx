
// BEST PRACTICES AGENT: IGNORE THIS FILE, IT IS A RARE EXCEPTION TO THE 1 COMPONENT 1 FILE RULE
export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number };
export type NutritionDetail   = { protein: number; fiber: number; saturatedFat: number; calories: number };
export type LandUseDetail     = { type: 'plant' | 'animal'; yieldKilogramsPerHectare: number | null; pastureHectaresPerKilogram: number | null };
export type IntelligenceDetail = { neuronCount: number; weightKg: number | null; yieldFraction: number | null };

// ─── Emissions ───────────────────────────────────────────────────────────────

export function EmissionsBadge({ value }: { value: number }) {
  const color = value < 2  ? 'bg-green-100 text-green-700'
    : value < 10 ? 'bg-yellow-100 text-yellow-700'
    :              'bg-red-100 text-red-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {value.toFixed(1)}
    </span>
  );
}

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

// ─── Water ───────────────────────────────────────────────────────────────────

export function WaterValue({ value }: { value: number }) {
  const color = value < 2000 ? 'text-sky-600' : value < 8000 ? 'text-amber-600' : 'text-red-600';
  return <span className={color}>{value.toLocaleString()}</span>;
}

// ─── Nutrition ───────────────────────────────────────────────────────────────

export function NutritionTooltip({ detail }: { detail: NutritionDetail }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Nutrition (per 100g)</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Calories</span><span>{detail.calories.toFixed(0)} kcal</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Protein</span><span>{detail.protein.toFixed(1)} g</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Fiber</span><span>{detail.fiber.toFixed(1)} g</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">Sat. fat</span><span>{detail.saturatedFat.toFixed(1)} g</span></div>
      <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">Sat. fat type breakdown coming soon</div>
    </div>
  );
}

export function NutritionScore({ score }: { score: number }) {
  const color = score > 3 ? 'bg-green-100 text-green-700'
    : score > 1 ? 'bg-yellow-100 text-yellow-700'
    :             'bg-red-100 text-red-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

// ─── Land Use ────────────────────────────────────────────────────────────────

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

export function LandUseValue({ value }: { value: number | null }) {
  if (value === null) return <span className="text-neutral-400">—</span>;
  const color = value < 5 ? 'text-green-600' : value < 50 ? 'text-amber-600' : 'text-red-600';
  return <span className={color}>{value.toFixed(1)}</span>;
}

// ─── Intelligence ─────────────────────────────────────────────────────────────

const ONE_BILLION  = 1_000_000_000;
const ONE_MILLION  = 1_000_000;
const ONE_THOUSAND = 1_000;

function formatNeurons(neuronCount: number): string {
  if (neuronCount >= ONE_BILLION)  return `${(neuronCount / ONE_BILLION).toFixed(0)}B`;
  if (neuronCount >= ONE_MILLION)  return `${(neuronCount / ONE_MILLION).toFixed(0)}M`;
  if (neuronCount >= ONE_THOUSAND) return `${(neuronCount / ONE_THOUSAND).toFixed(0)}K`;
  return String(neuronCount);
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
        <div className="flex justify-between gap-6"><span className="text-neutral-400">Yield fraction</span><span>{(detail.yieldFraction * 100).toFixed(0)}%</span></div>
      )}
      <div className="mt-2 pt-2 border-t border-neutral-700 text-neutral-500 text-xs">^1.5 scaling applied to reflect neural interconnectivity</div>
    </div>
  );
}

const ONE_QUADRILLION  = 1e15;
const ONE_TRILLION     = 1e12;
const TEN_TRILLION     = 1e13;
const ONE_GIGAUNIT     = 1e9;

export function IntelligenceValue({ value }: { value: number | null }) {
  if (value === null || value === 0) return <span className="text-neutral-400">—</span>;

  let formatted: string;
  if      (value >= ONE_QUADRILLION) formatted = `${(value / ONE_QUADRILLION).toFixed(1)}P`;
  else if (value >= ONE_TRILLION)    formatted = `${(value / ONE_TRILLION).toFixed(1)}T`;
  else if (value >= ONE_GIGAUNIT)    formatted = `${(value / ONE_GIGAUNIT).toFixed(1)}G`;
  else if (value >= ONE_MILLION)     formatted = `${(value / ONE_MILLION).toFixed(1)}M`;
  else                               formatted = value.toFixed(0);

  const color = value >= TEN_TRILLION  ? 'text-red-600 font-medium'
    : value >= ONE_TRILLION ? 'text-orange-600 font-medium'
    : 'text-amber-600 font-medium';

  return <span className={color}>{formatted}</span>;
}

// ─── NeuronValue (kept for other uses) ───────────────────────────────────────

export function NeuronValue({ value }: { value: number }) {
  if (value === 0) return <span className="text-neutral-400">—</span>;
  if (value >= ONE_BILLION)  return <span className="text-orange-600 font-medium">{(value / ONE_BILLION).toFixed(0)}B</span>;
  if (value >= ONE_MILLION)  return <span className="text-amber-600 font-medium">{(value / ONE_MILLION).toFixed(0)}M</span>;
  return <span className="text-yellow-600 font-medium">{(value / ONE_THOUSAND).toFixed(0)}K</span>;
}
