import { getNormalizedDb, rowsToObjects } from '@/lib/db';

export type RawFood = {
  name: string; slug: string; type: 'plant' | 'animal';
  calories: number; fat: number; protein: number; fiber: number; sat_fat: number;
  sodium: number | null; carbs: number | null; sugar: number | null;
  cholesterol: number | null; trans_fat: number | null;
  yield_kg_ha: number | null; pasture_ha_per_kg_output: number | null;
  emissions_per_kg: number | null; water_per_kg: number | null;
  neuron_count: number; weight_kg: number | null; yield_fraction: number | null;
  ch4_kg_per_kg_output: number | null;
  n2o_kg_per_kg_output: number | null;
  co2_kg_per_kg_output: number | null;
  green_water_per_kg: number | null;
  blue_water_per_kg:  number | null;
  feed_water_per_kg: number | null;
  feed_emissions_per_kg: number | null;
  feed_green_water_per_kg: number | null;
  feed_blue_water_per_kg:  number | null;
};

const QUERY = `
  SELECT f.food_id, f.is_feed, f.slug, f.name, f.type, f.tags, f.human_food,
         f.calories, f.fat, f.sat_fat, f.protein, f.fiber,
         f.sodium, f.carbs, f.sugar, f.cholesterol, f.trans_fat,
         f.yield_kg_ha, f.water_per_kg, f.green_water_per_kg, f.blue_water_per_kg,
         f.soil_erosion, f.pesticide_kg_ha,
         f.fertilizer_kg_ha, f.emissions_per_kg, f.tillage_events_per_year, f.co2_capture_kg_ha_yr,
         f.pesticide_freshwater_paf, f.pesticide_terrestrial_paf, f.pesticide_insect_paf, f.pesticide_bee_hazard, f.pesticide_kg_per_kg_food,
         f.neuron_count, f.weight_kg, f.yield_fraction, f.pasture_ha_per_kg_output,
         f.native_fraction, f.bycatch_amount,
         f.ch4_kg_per_kg_output, f.n2o_kg_per_kg_output, f.co2_kg_per_kg_output,
         feed.water_per_kg       AS feed_water_per_kg,
         feed.emissions_per_kg   AS feed_emissions_per_kg,
         feed.green_water_per_kg AS feed_green_water_per_kg,
         feed.blue_water_per_kg  AS feed_blue_water_per_kg
  FROM   foods_normalized f
  LEFT JOIN foods_normalized feed ON feed.food_id = f.food_id AND feed.is_feed = 1
  WHERE  f.is_feed = 0
`;

export async function fetchCommonFoods(): Promise<RawFood[]> {
  const db = await getNormalizedDb();
  return rowsToObjects(db.exec(QUERY)) as unknown as RawFood[];
}
