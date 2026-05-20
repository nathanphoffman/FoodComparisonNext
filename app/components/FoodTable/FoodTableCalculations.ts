export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number };

export type NutritionDetail = {
  protein:       number;
  fiber:         number;
  saturatedFat:  number;
  calories:      number;
  sodium:        number | null;
  carbs:         number | null;
  sugar:         number | null;
  cholesterol:   number | null;
  transFat:      number | null;
  glycemicIndex: number | null;
};

export type LandUseDetail = {
  type:                       'plant' | 'animal';
  yieldKilogramsPerHectare:   number | null;
  pastureHectaresPerKilogram: number | null;
};

export type IntelligenceDetail = {
  neuronCount:   number;
  weightKg:      number | null;
  yieldFraction: number | null;
};

const ONE_THOUSAND    = 1_000;
const ONE_MILLION     = 1_000_000;
export const ONE_BILLION     = 1_000_000_000;
const ONE_GIGAUNIT    = 1e9;
const ONE_TRILLION    = 1e12;
const TEN_TRILLION    = 1e13;
const ONE_QUADRILLION = 1e15;

export function formatNeurons(neuronCount: number): string {
  if (neuronCount >= ONE_BILLION)  return `${(neuronCount / ONE_BILLION).toFixed(0)}B`;
  if (neuronCount >= ONE_MILLION)  return `${(neuronCount / ONE_MILLION).toFixed(0)}M`;
  if (neuronCount >= ONE_THOUSAND) return `${(neuronCount / ONE_THOUSAND).toFixed(0)}K`;
  return String(neuronCount);
}

export function formatIntelligenceValue(value: number): string {
  if (value >= ONE_QUADRILLION) return `${(value / ONE_QUADRILLION).toFixed(1)}P`;
  if (value >= ONE_TRILLION)    return `${(value / ONE_TRILLION).toFixed(1)}T`;
  if (value >= ONE_GIGAUNIT)    return `${(value / ONE_GIGAUNIT).toFixed(1)}G`;
  if (value >= ONE_MILLION)     return `${(value / ONE_MILLION).toFixed(1)}M`;
  return value.toFixed(0);
}

export function getIntelligenceColor(value: number): string {
  if (value >= TEN_TRILLION) return 'text-red-600 font-medium';
  if (value >= ONE_TRILLION) return 'text-orange-600 font-medium';
  return 'text-amber-600 font-medium';
}

export function getEmissionsColor(value: number): string {
  if (value < 2)  return 'bg-green-100 text-green-700';
  if (value < 10) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function getWaterColor(value: number): string {
  if (value < 2000) return 'text-sky-600';
  if (value < 8000) return 'text-amber-600';
  return 'text-red-600';
}

export function getNutritionScoreColor(score: number): string {
  if (score > 3) return 'bg-green-100 text-green-700';
  if (score > 1) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function getLandUseColor(value: number): string {
  if (value < 5)  return 'text-green-600';
  if (value < 50) return 'text-amber-600';
  return 'text-red-600';
}

export function nutritionScale(calories: number): number {
  return calories > 0 ? 100 / calories : 0;
}
