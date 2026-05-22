import type { RawFood } from '@/lib/queries/commonFoods';
import type { EmissionsBreakdown, FoodEthics, FoodWeights, WaterDetail } from './FoodTableTypes';

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

export function effectiveWater(food: FoodEthics, greenWaterWeight: number): number | null {
    const { green, blue } = food.waterDetail;
    if (green != null && blue != null) {
        return blue + (greenWaterWeight / 100) * green;
    }
    return food.water;
}

export function getUnitLabel(weights: FoodWeights): string {
    if (weights.mass     === 100) return 'kg';
    if (weights.calories === 100) return '1000 kcal';
    if (weights.protein  === 100) return '100g protein';
    return 'weighted unit';
}

export function mapRawFoodToFoodEthics(food: RawFood): FoodEthics {
  let nutritionScore: number | null = null;
  if (food.calories > 0) {
    const rawScore = food.protein + FIBER_SCORE_WEIGHT * food.fiber - SATURATED_FAT_SCORE_PENALTY * food.sat_fat;
    nutritionScore = (rawScore / food.calories) * NUTRITION_SCORE_SCALE;
  }

  const isPlant       = food.type === 'plant';
  const hasPlantYield = food.yield_kg_ha != null && food.yield_kg_ha > 0;
  const hasPasture    = food.pasture_ha_per_kg_output != null;

  const landUse = isPlant
    ? (hasPlantYield ? SQUARE_METERS_PER_HECTARE / food.yield_kg_ha! : null)
    : (hasPasture    ? food.pasture_ha_per_kg_output! * SQUARE_METERS_PER_HECTARE : null);

  let intelligence: number | null = null;
  
  const hasIntelligenceData = food.neuron_count > 0
    && food.weight_kg != null && food.weight_kg > 0
    && food.yield_fraction != null && food.yield_fraction > 0;

  if (hasIntelligenceData) {
    const neuronScore = Math.pow(food.neuron_count, NEURAL_INTERCONNECTIVITY_EXPONENT);
    const edibleMass  = food.weight_kg! * food.yield_fraction!;
    intelligence = neuronScore / edibleMass;
  }

  let emissions: number | null = null;
  let emissionsBreakdown: EmissionsBreakdown | undefined = undefined;
  const hasAnimalGasBreakdown = food.type === 'animal' && food.ch4_kg_per_kg_output != null;
  if (hasAnimalGasBreakdown) {
    const co2          = food.co2_kg_per_kg_output as number;
    const ch4          = food.ch4_kg_per_kg_output as number;
    const n2o          = food.n2o_kg_per_kg_output as number;
    const feedEmissions = food.feed_emissions_per_kg ?? 0;
    emissions = co2 + ch4 + n2o + feedEmissions;
    emissionsBreakdown = {
      co2,
      ch4,
      n2o,
      feedEmissions: food.feed_emissions_per_kg ?? undefined,
    };
  } else {
    emissions = food.emissions_per_kg;
  }

  let water: number | null;
  let waterDetail: WaterDetail;
  if (food.type === 'animal') {
    water = food.feed_water_per_kg;
    waterDetail = { green: food.feed_green_water_per_kg, blue: food.feed_blue_water_per_kg };
  } else {
    water = food.water_per_kg;
    waterDetail = { green: food.green_water_per_kg, blue: food.blue_water_per_kg };
  }

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
    emissions,
    emissionsBreakdown,
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
    water,
    waterDetail,
  };
}
