import type { RawFood } from '@/lib/queries/commonFoods';
import type { FoodEthics, FoodWeights } from './FoodTableTypes';

const ONE_THOUSAND    = 1_000;
export const ONE_MILLION     = 1_000_000;
export const ONE_BILLION     = 1_000_000_000;
export const ONE_TRILLION    = 1e12;
const ONE_QUADRILLION = 1e15;

const NUTRITION_SCORE_CALORIES_BASIS = 100;

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

export function nutritionScale(calories: number): number {
  return calories > 0 ? NUTRITION_SCORE_CALORIES_BASIS / calories : 0;
}

const SQUARE_METERS_PER_HECTARE         = 10000;
const NEURAL_INTERCONNECTIVITY_EXPONENT = 1.5;
const NUTRITION_SCORE_SCALE             = 100;
const FIBER_SCORE_WEIGHT                = 2;
const SATURATED_FAT_SCORE_PENALTY       = 2;

const CALORIE_NORM = 1_000; // kcal/kg — "per 1000 kcal" when cal=100%
const PROTEIN_NORM = 100;   // g/kg   — "per 100g protein" when protein=100%

export function computeDivisor(food: FoodEthics, weights: FoodWeights): number {
    const caloriesPerKg = food.nutritionDetail.calories * 1_000;
    const proteinPerKg  = food.nutritionDetail.protein  * 1_000;
    const d = (weights.mass     / 100) * 1
            + (weights.calories / 100) * (caloriesPerKg / CALORIE_NORM)
            + (weights.protein  / 100) * (proteinPerKg  / PROTEIN_NORM);
    return d > 0 ? d : 1;
}

export function getUnitLabel(weights: FoodWeights): string {
    if (weights.mass     === 100) return 'kg';
    if (weights.calories === 100) return '1000 kcal';
    if (weights.protein  === 100) return '100g protein';
    return 'weighted unit';
}

export function mapRawFoodToFoodEthics(food: RawFood): FoodEthics {
  const nutritionScore = food.calories > 0
    ? (food.protein + FIBER_SCORE_WEIGHT * food.fiber - SATURATED_FAT_SCORE_PENALTY * food.sat_fat) / food.calories * NUTRITION_SCORE_SCALE
    : null;

  const landUse = food.type === 'plant'
    ? (food.yield_kg_ha != null && food.yield_kg_ha > 0 ? SQUARE_METERS_PER_HECTARE / food.yield_kg_ha : null)
    : (food.pasture_ha_per_kg_output != null ? food.pasture_ha_per_kg_output * SQUARE_METERS_PER_HECTARE : null);

  const intelligence = food.neuron_count > 0
    && food.weight_kg != null && food.weight_kg > 0
    && food.yield_fraction != null && food.yield_fraction > 0
    ? Math.pow(food.neuron_count, NEURAL_INTERCONNECTIVITY_EXPONENT) / (food.weight_kg * food.yield_fraction)
    : null;

  return {
    name: food.name,
    slug: food.slug,
    nutritionScore,
    nutritionDetail: {
      calories:      food.calories,
      fat:           food.fat,
      saturatedFat:  food.sat_fat,
      transFat:      food.trans_fat,
      cholesterol:   food.cholesterol,
      sodium:        food.sodium,
      carbs:         food.carbs,
      fiber:         food.fiber,
      sugar:         food.sugar,
      protein:       food.protein,
    },
    emissions: food.emissions_per_kg,
    emissionsBreakdown: food.ch4_kg_per_kg_output != null ? {
      co2: food.co2_kg_per_kg_output as number,
      ch4: food.ch4_kg_per_kg_output,
      n2o: food.n2o_kg_per_kg_output as number,
    } : undefined,
    landUse,
    landUseDetail: {
      type:                       food.type,
      yieldKilogramsPerHectare:   food.yield_kg_ha,
      pastureHectaresPerKilogram: food.pasture_ha_per_kg_output,
    },
    intelligence,
    intelligenceDetail: {
      neuronCount:   food.neuron_count,
      weightKg:      food.weight_kg,
      yieldFraction: food.yield_fraction,
    },
    water: food.water_per_kg,
  };
}
