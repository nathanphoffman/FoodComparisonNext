import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb, rowsToObjects } from '@/lib/db';
import type { Food, Plant, Animal } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FoodPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDb();

  const foodResult = db.exec('SELECT * FROM foods WHERE slug = :slug', {
    ':slug': slug,
  });
  if (!foodResult.length) notFound();

  const food = rowsToObjects(foodResult)[0] as unknown as Food;

  let detail: Plant | Animal | null = null;
  if (food.type === 'plant') {
    const r = db.exec('SELECT * FROM plants WHERE food_id = :id', { ':id': food.id });
    detail = (rowsToObjects(r)[0] as unknown as Plant) ?? null;
  } else if (food.type === 'animal') {
    const r = db.exec('SELECT * FROM animals WHERE food_id = :id', { ':id': food.id });
    detail = (rowsToObjects(r)[0] as unknown as Animal) ?? null;
  }

  const nutrientPer100g = (val: number) => (val * 100).toFixed(1) + 'g';

  return (
    <div>
      <p>
        <Link href="/foods">&larr; All foods</Link>
      </p>

      <h1>{food.name}</h1>
      <p>Type: {food.type}</p>

      <h2>Nutrition (per 100g)</h2>
      <table>
        <tbody>
          <tr><td>Calories</td><td>{(food.calories * 100).toFixed(0)} kcal</td></tr>
          <tr><td>Fat</td><td>{nutrientPer100g(food.fat)}</td></tr>
          <tr><td>Saturated fat</td><td>{nutrientPer100g(food.sat_fat)}</td></tr>
          <tr><td>Protein</td><td>{nutrientPer100g(food.protein)}</td></tr>
          <tr><td>Fiber</td><td>{nutrientPer100g(food.fiber)}</td></tr>
        </tbody>
      </table>

      {food.type === 'plant' && detail && (
        <>
          <h2>Environmental data</h2>
          <table>
            <tbody>
              {(detail as Plant).yield_kg_ha != null && (
                <tr><td>Yield</td><td>{(detail as Plant).yield_kg_ha} kg/ha</td></tr>
              )}
              {(detail as Plant).water_per_kg != null && (
                <tr><td>Water use</td><td>{(detail as Plant).water_per_kg} L/kg</td></tr>
              )}
              {(detail as Plant).emissions_per_kg != null && (
                <tr><td>GHG emissions</td><td>{(detail as Plant).emissions_per_kg} kg CO₂e/kg</td></tr>
              )}
              {(detail as Plant).pesticide_kg_ha != null && (
                <tr><td>Pesticide use</td><td>{(detail as Plant).pesticide_kg_ha} kg/ha</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {food.type === 'animal' && detail && (
        <>
          <h2>Animal data</h2>
          <table>
            <tbody>
              {(detail as Animal).neuron_count != null && (
                <tr><td>Neuron count</td><td>{(detail as Animal).neuron_count?.toLocaleString()}</td></tr>
              )}
              {(detail as Animal).weight_kg != null && (
                <tr><td>Live weight</td><td>{(detail as Animal).weight_kg} kg</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
