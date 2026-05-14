import Link from 'next/link';
import { getDb, rowsToObjects } from '@/lib/db';
import type { Food } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FoodsPage() {
  const db = await getDb();
  const result = db.exec('SELECT * FROM foods WHERE human_food = 1 ORDER BY type, name');
  const foods = rowsToObjects(result) as unknown as Food[];

  const plants = foods.filter((f) => f.type === 'plant');
  const animals = foods.filter((f) => f.type === 'animal');

  return (
    <div>
      <h1>Foods</h1>

      <section>
        <h2>Plants</h2>
        <ul>
          {plants.map((food) => (
            <li key={food.slug}>
              <Link href={`/foods/${food.slug}`}>{food.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Animals</h2>
        <ul>
          {animals.map((food) => (
            <li key={food.slug}>
              <Link href={`/foods/${food.slug}`}>{food.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
