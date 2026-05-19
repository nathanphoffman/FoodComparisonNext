export interface ISourced<T> {
  value: T;
  source_id: number;
  confidence: number;
}

export interface NutritionValue {
  calories: number;
  fat: number;
  sat_fat: number;
  protein: number;
  fiber: number;
}

export interface Food {
  id: number;
  slug: string;
  name: string;
  type: 'plant' | 'animal';
  nutrition: ISourced<NutritionValue>[];
  human_food: 0 | 1;
  tags: string[];
}

export interface Animal {
  id: number;
  food_id: number;
  neuron_count: ISourced<number>[] | null;
  weight_kg: ISourced<number>[] | null;
  bycatch_animal_id: number | null;
  bycatch_amount: ISourced<number>[] | null;
  yield_fraction: ISourced<number>[] | null;
  pasture_ha_per_kg_output: ISourced<number>[] | null;
  native_fraction: ISourced<number>[] | null;
}

export interface Plant {
  id: number;
  food_id: number;
  yield_kg_ha: ISourced<number>[] | null;
  water_per_kg: ISourced<number>[] | null;
  soil_erosion: ISourced<number>[] | null;
  pesticide_kg_ha: ISourced<number>[] | null;
  fertilizer_kg_ha: ISourced<number>[] | null;
  emissions_per_kg: ISourced<number>[] | null;
  tillage_events_per_year: ISourced<number>[] | null;
  co2_capture_kg_ha_yr: ISourced<number>[] | null;
}

export interface Source {
  id: number;
  url: string;
  title: string;
  notes: string[] | null;
}

export interface AnimalFeed {
  id: number;
  animal_id: number;
  plant_id: number;
  kg_feed_per_kg_output: ISourced<number>[];
}

export interface PlantAnimalKill {
  id: number;
  plant_id: number;
  animal_id: number;
  kills_per_ha: ISourced<number>[] | null;
}

export interface Pesticide {
  id: number;
  name: string;
  paf: ISourced<number>[];
}

export interface PlantPesticide {
  id: number;
  plant_id: number;
  pesticide_id: number;
  kg_ha: ISourced<number>[] | null;
}
