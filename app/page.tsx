import Link from 'next/link';
import { FoodTable } from './components/FoodTable/FoodTable';
import { getNormalizedDb, rowsToObjects } from '@/lib/db';

export default async function Home() {

  const query = `
    SELECT food_id, is_feed, slug, name, type, tags, human_food,
           calories, fat, sat_fat, protein, fiber,
           yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha,
           fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr,
           pesticide_freshwater_paf, pesticide_terrestrial_paf, pesticide_bee_hazard, pesticide_kg_per_kg_food,
           neuron_count, weight_kg, yield_fraction, pasture_ha_per_kg_output,
           native_fraction, bycatch_amount
    FROM   foods_normalized
    WHERE  is_feed = 0
    AND    EXISTS (
      SELECT 1 FROM json_each(tags) WHERE value = 'common'
    )
  `;

  const db = await getNormalizedDb();
  const foods = rowsToObjects(db.exec(query));

  const foodTable = foods.map((food) => ({
    name: food.name,
    calories: food.calories,
  }));

  console.log(JSON.stringify(foods[0]));

  const headers = [
    "Name",
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Food Comparison</h1>
      <p>
        Explore foods by their nutritional profiles, environmental footprints,
        and the ethical dimensions of how they are produced.
      </p>
      <Link href="/foods">Browse all foods &rarr;</Link>
      <FoodTable />
    </div>
  );
}
