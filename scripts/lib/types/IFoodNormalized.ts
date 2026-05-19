export interface IFoodNormalized {
  id: number;
  slug: string;
  name: string;
  type: 'plant' | 'animal';
  tags: string[];
  human_food: 0 | 1;
  // nutrition
  calories: number | null;
  fat: number | null;
  sat_fat: number | null;
  protein: number | null;
  fiber: number | null;
  // plant averages (null for animal foods)
  yield_kg_ha: number | null;
  water_per_kg: number | null;
  soil_erosion: number | null;
  pesticide_kg_ha: number | null;
  fertilizer_kg_ha: number | null;
  emissions_per_kg: number | null;
  tillage_events_per_year: number | null;
  co2_capture_kg_ha_yr: number | null;
  pesticide_weighted_paf: number | null;
  pesticide_kg_per_kg_food: number | null;
  // animal averages (null for plant foods)
  neuron_count: number | null;
  weight_kg: number | null;
  yield_fraction: number | null;
  pasture_ha_per_kg_output: number | null;
  native_fraction: number | null;
  bycatch_amount: number | null;
}

export type PlantNormalizedFields = Pick<IFoodNormalized,
  | 'yield_kg_ha' | 'water_per_kg' | 'soil_erosion' | 'pesticide_kg_ha'
  | 'fertilizer_kg_ha' | 'emissions_per_kg' | 'tillage_events_per_year'
  | 'co2_capture_kg_ha_yr' | 'pesticide_weighted_paf' | 'pesticide_kg_per_kg_food'
>;

export type AnimalNormalizedFields = Pick<IFoodNormalized,
  | 'neuron_count' | 'weight_kg' | 'yield_fraction' | 'pasture_ha_per_kg_output'
  | 'native_fraction' | 'bycatch_amount'
>;

export class FoodNormalized implements IFoodNormalized {
  id!: number;
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
  yield_kg_ha!: number | null;
  water_per_kg!: number | null;
  soil_erosion!: number | null;
  pesticide_kg_ha!: number | null;
  fertilizer_kg_ha!: number | null;
  emissions_per_kg!: number | null;
  tillage_events_per_year!: number | null;
  co2_capture_kg_ha_yr!: number | null;
  pesticide_weighted_paf!: number | null;
  pesticide_kg_per_kg_food!: number | null;
  neuron_count!: number | null;
  weight_kg!: number | null;
  yield_fraction!: number | null;
  pasture_ha_per_kg_output!: number | null;
  native_fraction!: number | null;
  bycatch_amount!: number | null;

  constructor(data: IFoodNormalized) {
    Object.assign(this, data);
  }

  toDbParams(): (string | number | null)[] {
    return [
      this.id, this.slug, this.name, this.type,
      JSON.stringify(this.tags), this.human_food,
      this.calories, this.fat, this.sat_fat, this.protein, this.fiber,
      this.yield_kg_ha, this.water_per_kg, this.soil_erosion, this.pesticide_kg_ha,
      this.fertilizer_kg_ha, this.emissions_per_kg, this.tillage_events_per_year,
      this.co2_capture_kg_ha_yr, this.pesticide_weighted_paf, this.pesticide_kg_per_kg_food,
      this.neuron_count, this.weight_kg, this.yield_fraction,
      this.pasture_ha_per_kg_output, this.native_fraction, this.bycatch_amount,
    ];
  }
}
