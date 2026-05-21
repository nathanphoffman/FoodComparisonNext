import Link from 'next/link';
import { FoodTable } from './components/FoodTable/FoodTable';
import { fetchCommonFoods } from '@/lib/queries/commonFoods';
import { mapRawFoodToFoodEthics } from './components/FoodTable/FoodTableCalculations';

export default async function Home() {
  const raw = await fetchCommonFoods();
  const foodTable = raw.map(mapRawFoodToFoodEthics);

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
