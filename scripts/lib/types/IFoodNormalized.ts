export interface IFoodNormalized {
  food_id: number;
  is_feed: 0 | 1;
  slug: string;
  name: string;
  type: 'plant' | 'animal';
  tags: string[];
  human_food: 0 | 1;
  // nutrition (NULL for feed rows)
  calories: number | null;
  fat: number | null;
  sat_fat: number | null;
  protein: number | null;
  fiber: number | null;
  sodium: number | null;
  carbs: number | null;
  sugar: number | null;
  cholesterol: number | null;
  trans_fat: number | null;
  // plant metrics (NULL for animal foods; populated for plants AND feed rows)
  yield_kg_ha: number | null;
  water_per_kg: number | null;
  green_water_per_kg: number | null;
  blue_water_per_kg: number | null;
  grey_water_per_kg: number | null;
  soil_erosion: number | null;
  pesticide_kg_ha: number | null;
  fertilizer_kg_ha: number | null;
  emissions_per_kg: number | null;
  tillage_events_per_year: number | null;
  co2_capture_kg_ha_yr: number | null;
  pesticide_freshwater_paf: number | null;
  pesticide_terrestrial_paf: number | null;
  pesticide_insect_paf: number | null;
  pesticide_bee_hazard: number | null;
  pesticide_kg_per_kg_food: number | null;
  // animal metrics (NULL for plant foods and feed rows)
  neuron_count: number | null;
  weight_kg: number | null;
  yield_fraction: number | null;
  pasture_ha_per_kg_output: number | null;
  pasture_green_water_l_per_ha: number | null;
  native_fraction: number | null;
  bycatch_amount: number | null;
  ch4_kg_per_kg_output: number | null;
  n2o_kg_per_kg_output: number | null;
  co2_kg_per_kg_output: number | null;
}

export type PlantNormalizedFields = Pick<IFoodNormalized,
  | 'yield_kg_ha' | 'yield_fraction' | 'water_per_kg' | 'green_water_per_kg' | 'blue_water_per_kg' | 'grey_water_per_kg'
  | 'soil_erosion' | 'pesticide_kg_ha'
  | 'fertilizer_kg_ha' | 'emissions_per_kg' | 'tillage_events_per_year'
  | 'co2_capture_kg_ha_yr' | 'pesticide_freshwater_paf' | 'pesticide_terrestrial_paf'
  | 'pesticide_insect_paf' | 'pesticide_bee_hazard' | 'pesticide_kg_per_kg_food'
>;

export type AnimalNormalizedFields = Pick<IFoodNormalized,
  | 'neuron_count' | 'weight_kg' | 'yield_fraction' | 'pasture_ha_per_kg_output'
  | 'pasture_green_water_l_per_ha' | 'native_fraction' | 'bycatch_amount'
  | 'ch4_kg_per_kg_output' | 'n2o_kg_per_kg_output' | 'co2_kg_per_kg_output'
>;

export class FoodNormalized implements IFoodNormalized {
  food_id!: number;
  is_feed!: 0 | 1;
  slug!: string;
  name!: string;
  type!: 'plant' | 'animal';
  tags!: string[];
  human_food!: 0 | 1;
  calories!: number | null;
  fat!: number | null;
  sat_fat!: number | null;
  protein!: number | null;
  fiber!: number | null;
  sodium!: number | null;
  carbs!: number | null;
  sugar!: number | null;
  cholesterol!: number | null;
  trans_fat!: number | null;
  yield_kg_ha!: number | null;
  water_per_kg!: number | null;
  green_water_per_kg!: number | null;
  blue_water_per_kg!: number | null;
  grey_water_per_kg!: number | null;
  soil_erosion!: number | null;
  pesticide_kg_ha!: number | null;
  fertilizer_kg_ha!: number | null;
  emissions_per_kg!: number | null;
  tillage_events_per_year!: number | null;
  co2_capture_kg_ha_yr!: number | null;
  pesticide_freshwater_paf!: number | null;
  pesticide_terrestrial_paf!: number | null;
  pesticide_insect_paf!: number | null;
  pesticide_bee_hazard!: number | null;
  pesticide_kg_per_kg_food!: number | null;
  neuron_count!: number | null;
  weight_kg!: number | null;
  yield_fraction!: number | null;
  pasture_ha_per_kg_output!: number | null;
  pasture_green_water_l_per_ha!: number | null;
  native_fraction!: number | null;
  bycatch_amount!: number | null;
  ch4_kg_per_kg_output!: number | null;
  n2o_kg_per_kg_output!: number | null;
  co2_kg_per_kg_output!: number | null;

  constructor(data: IFoodNormalized) {
    Object.assign(this, data);
  }

  toDbParams(): (string | number | null)[] {
    return [
      this.food_id, this.is_feed,
      this.slug, this.name, this.type,
      JSON.stringify(this.tags), this.human_food,
      this.calories, this.fat, this.sat_fat, this.protein, this.fiber,
      this.sodium, this.carbs, this.sugar, this.cholesterol, this.trans_fat,
      this.yield_kg_ha, this.water_per_kg, this.green_water_per_kg, this.blue_water_per_kg, this.grey_water_per_kg,
      this.soil_erosion, this.pesticide_kg_ha,
      this.fertilizer_kg_ha, this.emissions_per_kg, this.tillage_events_per_year,
      this.co2_capture_kg_ha_yr, this.pesticide_freshwater_paf, this.pesticide_terrestrial_paf,
      this.pesticide_insect_paf, this.pesticide_bee_hazard, this.pesticide_kg_per_kg_food,
      this.neuron_count, this.weight_kg, this.yield_fraction,
      this.pasture_ha_per_kg_output, this.pasture_green_water_l_per_ha, this.native_fraction, this.bycatch_amount,
      this.ch4_kg_per_kg_output, this.n2o_kg_per_kg_output, this.co2_kg_per_kg_output,
    ];
  }
}
