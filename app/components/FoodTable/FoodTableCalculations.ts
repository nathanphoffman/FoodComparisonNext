const ONE_THOUSAND    = 1_000;
export const ONE_MILLION     = 1_000_000;
export const ONE_BILLION     = 1_000_000_000;
const ONE_TRILLION    = 1e12;
const TEN_TRILLION    = 1e13;
const ONE_QUADRILLION = 1e15;

// Emissions thresholds (kg CO₂e per kg food)
const LOW_EMISSIONS_THRESHOLD    = 2;
const HIGH_EMISSIONS_THRESHOLD   = 10;

// Water use thresholds (litres per kg food)
const LOW_WATER_USE_THRESHOLD    = 2_000;
const HIGH_WATER_USE_THRESHOLD   = 8_000;

// Nutrition score thresholds
const GOOD_NUTRITION_SCORE_THRESHOLD = 3;
const FAIR_NUTRITION_SCORE_THRESHOLD = 1;
const NUTRITION_SCORE_CALORIES_BASIS = 100;

// Land use thresholds (m² per kg food)
const LOW_LAND_USE_THRESHOLD     = 5;
const HIGH_LAND_USE_THRESHOLD    = 50;

export function formatNeurons(neuronCount: number): string {
  if (neuronCount >= ONE_BILLION)  return `${(neuronCount / ONE_BILLION).toFixed(0)}B`;
  if (neuronCount >= ONE_MILLION)  return `${(neuronCount / ONE_MILLION).toFixed(0)}M`;
  if (neuronCount >= ONE_THOUSAND) return `${(neuronCount / ONE_THOUSAND).toFixed(0)}K`;
  return String(neuronCount);
}

export function formatIntelligenceValue(value: number): string {
  if (value >= ONE_QUADRILLION) return `${(value / ONE_QUADRILLION).toFixed(1)}P`;
  if (value >= ONE_TRILLION)    return `${(value / ONE_TRILLION).toFixed(1)}T`;
  if (value >= ONE_BILLION)     return `${(value / ONE_BILLION).toFixed(1)}G`;
  if (value >= ONE_MILLION)     return `${(value / ONE_MILLION).toFixed(1)}M`;
  return value.toFixed(0);
}

export function getIntelligenceColor(value: number): string {
  if (value >= TEN_TRILLION) return 'text-red-600 font-medium';
  if (value >= ONE_TRILLION) return 'text-orange-600 font-medium';
  return 'text-amber-600 font-medium';
}

export function getEmissionsColor(value: number): string {
  if (value < LOW_EMISSIONS_THRESHOLD)  return 'bg-green-100 text-green-700';
  if (value < HIGH_EMISSIONS_THRESHOLD) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function getWaterColor(value: number): string {
  if (value < LOW_WATER_USE_THRESHOLD)  return 'text-sky-600';
  if (value < HIGH_WATER_USE_THRESHOLD) return 'text-amber-600';
  return 'text-red-600';
}

export function getNutritionScoreColor(score: number): string {
  if (score > GOOD_NUTRITION_SCORE_THRESHOLD) return 'bg-green-100 text-green-700';
  if (score > FAIR_NUTRITION_SCORE_THRESHOLD) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function getLandUseColor(value: number): string {
  if (value < LOW_LAND_USE_THRESHOLD)  return 'text-green-600';
  if (value < HIGH_LAND_USE_THRESHOLD) return 'text-amber-600';
  return 'text-red-600';
}

export function nutritionScale(calories: number): number {
  return calories > 0 ? NUTRITION_SCORE_CALORIES_BASIS / calories : 0;
}
