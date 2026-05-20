import Link from 'next/link';
import { FoodTable } from './components/FoodTable/FoodTable';
import { getNormalizedDb, rowsToObjects } from '@/lib/db';

type RawFood = {
  name: string; slug: string; type: 'plant' | 'animal';
  calories: number; protein: number; fiber: number; sat_fat: number;
  sodium: number | null; carbs: number | null; sugar: number | null;
  cholesterol: number | null; trans_fat: number | null; glycemic_index: number | null;
  yield_kg_ha: number | null; pasture_ha_per_kg_output: number | null;
  emissions_per_kg: number | null; water_per_kg: number | null;
  neuron_count: number; weight_kg: number | null; yield_fraction: number | null;
  ch4_kg_per_kg_output: number | null;
  n2o_kg_per_kg_output: number | null;
  co2_kg_per_kg_output: number | null;
};

export default async function Home() {

  const query = `
    SELECT food_id, is_feed, slug, name, type, tags, human_food,
           calories, fat, sat_fat, protein, fiber,
           sodium, carbs, sugar, cholesterol, trans_fat, glycemic_index,
           yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha,
           fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr,
           pesticide_freshwater_paf, pesticide_terrestrial_paf, pesticide_insect_paf, pesticide_bee_hazard, pesticide_kg_per_kg_food,
           neuron_count, weight_kg, yield_fraction, pasture_ha_per_kg_output,
           native_fraction, bycatch_amount,
           ch4_kg_per_kg_output, n2o_kg_per_kg_output, co2_kg_per_kg_output
    FROM   foods_normalized
    WHERE  is_feed = 0
    AND    EXISTS (
      SELECT 1 FROM json_each(tags) WHERE value = 'common'
    )
  `;

  const db    = await getNormalizedDb();
  const foods = rowsToObjects(db.exec(query)) as unknown as RawFood[];

  const foodTable = foods.map((food) => {
    const nutritionScore = food.calories > 0
      ? (food.protein + 2 * food.fiber - 2 * food.sat_fat) / food.calories * 100
      : null;

    const landUse = food.type === 'plant'
      ? (food.yield_kg_ha != null && food.yield_kg_ha > 0 ? 10000 / food.yield_kg_ha : null)
      : (food.pasture_ha_per_kg_output != null ? food.pasture_ha_per_kg_output * 10000 : null);

    const intelligence = food.neuron_count > 0
      && food.weight_kg != null && food.weight_kg > 0
      && food.yield_fraction != null && food.yield_fraction > 0
      ? Math.pow(food.neuron_count, 1.5) / (food.weight_kg * food.yield_fraction)
      : null;

    return {
      name: food.name,
      slug: food.slug,
      nutritionScore,
      nutritionDetail: {
        protein:       food.protein,
        fiber:         food.fiber,
        saturatedFat:  food.sat_fat,
        calories:      food.calories,
        sodium:        food.sodium,
        carbs:         food.carbs,
        sugar:         food.sugar,
        cholesterol:   food.cholesterol,
        transFat:      food.trans_fat,
        glycemicIndex: food.glycemic_index,
      },
      emissions: food.emissions_per_kg,
      emissionsBreakdown: food.ch4_kg_per_kg_output != null ? {
        co2: food.co2_kg_per_kg_output as number,
        ch4: food.ch4_kg_per_kg_output,
        n2o: food.n2o_kg_per_kg_output as number,
      } : undefined,
      landUse,
      landUseDetail: {
        type:           food.type,
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
  });

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Food Comparison</h1>
      <p>
        Explore foods by their nutritional profiles, environmental footprints,
        and the ethical dimensions of how they are produced.
      </p>
      <Link href="/foods">Browse all foods &rarr;</Link>
      <FoodTable data={foodTable} />
    </div>
  );
}
