import { Food } from '../../../lib/types';
import { SourcedNutritionalValueArray } from './SourcedNutritionalValueArray';
import { FoodNormalized, PlantNormalizedFields, AnimalNormalizedFields } from './IFoodNormalized';
import { RawPlant } from './RawPlant';
import { RawAnimal } from './RawAnimal';

const nullPlantFields: PlantNormalizedFields = {
  yield_kg_ha: null, yield_fraction: null, water_per_kg: null, green_water_per_kg: null, blue_water_per_kg: null, grey_water_per_kg: null,
  soil_erosion: null, pesticide_kg_ha: null, fertilizer_kg_ha: null, emissions_per_kg: null,
  tillage_events_per_year: null, co2_capture_kg_ha_yr: null,
  pesticide_freshwater_paf: null, pesticide_terrestrial_paf: null,
  pesticide_insect_paf: null, pesticide_bee_hazard: null, pesticide_kg_per_kg_food: null,
};

const nullAnimalFields: AnimalNormalizedFields = {
  neuron_count: null, weight_kg: null, yield_fraction: null,
  pasture_ha_per_kg_output: null, pasture_green_water_l_per_ha: null, native_fraction: null, bycatch_amount: null,
  ch4_kg_per_kg_output: null, n2o_kg_per_kg_output: null, co2_kg_per_kg_output: null,
};

export class RawFood {
  readonly nutrition: SourcedNutritionalValueArray;

  constructor(
    private data: Food,
    private plant: RawPlant | null,
    private animal: RawAnimal | null,
  ) {
    this.nutrition = new SourcedNutritionalValueArray(data.nutrition);
  }

  toNormalized(): FoodNormalized {
    const averageNutrition = this.nutrition.weightedAverage();
    return new FoodNormalized({
      food_id: this.data.id,
      is_feed: 0,
      slug: this.data.slug,
      name: this.data.name,
      type: this.data.type,
      tags: this.data.tags,
      human_food: this.data.human_food,
      calories:       averageNutrition?.calories ?? null,
      fat:            averageNutrition?.fat ?? null,
      sat_fat:        averageNutrition?.sat_fat ?? null,
      protein:        averageNutrition?.protein ?? null,
      fiber:          averageNutrition?.fiber ?? null,
      sodium:         averageNutrition?.sodium ?? null,
      carbs:          averageNutrition?.carbs ?? null,
      sugar:          averageNutrition?.sugar ?? null,
      cholesterol:    averageNutrition?.cholesterol ?? null,
      trans_fat:      averageNutrition?.trans_fat ?? null,
      ...(this.plant?.normalizedFields() ?? nullPlantFields),
      ...(this.animal?.normalizedFields() ?? nullAnimalFields),
    });
  }

  toFeedNormalized(): FoodNormalized | null {
    if (!this.animal) return null;
    const feedFields = this.animal.feedNormalizedFields();
    if (!feedFields) return null;

    return new FoodNormalized({
      food_id: this.data.id,
      is_feed: 1,
      slug: `${this.data.slug}-feed`,
      name: `${this.data.name} (Feed)`,
      type: this.data.type,
      tags: this.data.tags,
      human_food: this.data.human_food,
      calories: null, fat: null, sat_fat: null, protein: null, fiber: null,
      sodium: null, carbs: null, sugar: null, cholesterol: null, trans_fat: null,
      ...feedFields,
      ...nullAnimalFields,
    });
  }
}
