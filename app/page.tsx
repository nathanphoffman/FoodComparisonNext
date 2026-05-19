import Link from 'next/link';
import { Table } from './components/Table';
import { getDb, rowsToObjects } from '@/lib/db';
import { FoodQueryResult } from './types/FoodQueryResult';

export default async function Home() {

  const query = `SELECT json_object(
    'id',       f.id,
    'slug',     f.slug,
    'name',     f.name,
    'type',     f.type,
    'tags',     json(f.tags),
    'nutrition', json(f.nutrition),

    'plant', CASE WHEN p.id IS NULL THEN NULL ELSE json_object(
      'yield_kg_ha',             json(p.yield_kg_ha),
      'water_per_kg',            json(p.water_per_kg),
      'soil_erosion',            json(p.soil_erosion),
      'pesticide_kg_ha',         json(p.pesticide_kg_ha),
      'fertilizer_kg_ha',        json(p.fertilizer_kg_ha),
      'emissions_per_kg',        json(p.emissions_per_kg),
      'tillage_events_per_year', json(p.tillage_events_per_year),
      'co2_capture_kg_ha_yr',    json(p.co2_capture_kg_ha_yr),
      'pesticides', (
        SELECT json_group_array(json_object(
          'name',  pest.name,
          'paf',   json(pest.paf),
          'kg_ha', json(pp.kg_ha)
        ))
        FROM plant_pesticides pp
        JOIN pesticides pest ON pest.id = pp.pesticide_id
        WHERE pp.plant_id = p.id
      ),
      'animal_kills', (
        SELECT json_group_array(json_object(
          'animal',       fa.name,
          'kills_per_ha', json(pak.kills_per_ha)
        ))
        FROM plant_animal_kills pak
        JOIN animals ka ON ka.id = pak.animal_id
        JOIN foods fa   ON fa.id = ka.food_id
        WHERE pak.plant_id = p.id
      )
    ) END,

    'animal', CASE WHEN a.id IS NULL THEN NULL ELSE json_object(
      'neuron_count',             json(a.neuron_count),
      'weight_kg',                json(a.weight_kg),
      'yield_fraction',           json(a.yield_fraction),
      'pasture_ha_per_kg_output', json(a.pasture_ha_per_kg_output),
      'native_fraction',          json(a.native_fraction),
      'bycatch', CASE WHEN a.bycatch_animal_id IS NULL THEN NULL ELSE json_object(
        'animal', (
          SELECT f2.name FROM animals a2
          JOIN foods f2 ON f2.id = a2.food_id
          WHERE a2.id = a.bycatch_animal_id
        ),
        'amount', json(a.bycatch_amount)
      ) END,
      'feed', (
        SELECT json_group_array(json_object(
          'plant',                  fp.name,
          'kg_feed_per_kg_output',  json(af.kg_feed_per_kg_output)
        ))
        FROM animal_feed af
        JOIN plants fp_plant ON fp_plant.id = af.plant_id
        JOIN foods  fp       ON fp.id = fp_plant.food_id
        WHERE af.animal_id = a.id
      )
    ) END

  ) AS food
  FROM foods f
  LEFT JOIN plants  p ON p.food_id = f.id
  LEFT JOIN animals a ON a.food_id = f.id
  WHERE EXISTS (
    SELECT 1 FROM json_each(f.tags) WHERE value = 'common'
  );

`;


  const db = await getDb();
  const humanFoodsQueryResult = db.exec(query);
  const foods = rowsToObjects(humanFoodsQueryResult).map(
    (r) => JSON.parse(r.food as string) as FoodQueryResult
  );

  console.log(foods[0]);

  // want to use a food type here
  const foodTable = foods.map((food: FoodQueryResult)=>{
    return {
      name: food.name
    }
  });

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
      <Table></Table>
    </div>
  );
}
