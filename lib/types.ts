export interface Food {
  id: number;
  slug: string;
  name: string;
  type: 'plant' | 'animal';
  calories: number;
  fat: number;
  sat_fat: number;
  protein: number;
  fiber: number;
  human_food: 0 | 1;
  sources: string; // JSON array of source IDs
}

export interface Animal {
  id: number;
  food_id: number;
  neuron_count: number | null;
  weight_kg: number | null;
  bycatch_animal_id: number | null;
  bycatch_amount: number | null;
  sources: string | null;
}

export interface Plant {
  id: number;
  food_id: number;
  yield_kg_ha: number | null;
  water_per_kg: number | null;
  soil_erosion: number | null;
  pesticide_kg_ha: number | null;
  fertilizer_kg_ha: number | null;
  emissions_per_kg: number | null;
  tillage_events_per_year: number | null;
  co2_capture_kg_ha_yr: number | null;
  sources: string | null;
}

export interface Source {
  id: number;
  url: string;
  title: string;
  notes: string | null;
}

export interface AnimalFeed {
  id: number;
  animal_id: number;
  plant_id: number;
  kg_feed_per_kg_output: number;
  sources: string | null;
}

export interface PlantAnimalKill {
  id: number;
  plant_id: number;
  animal_id: number;
  kills_per_ha: number | null;
}

export interface Pesticide {
  id: number;
  name: string;
  paf: number;
}
