import { NextResponse } from 'next/server';
import { getDb, rowsToObjects } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  const result = db.exec('SELECT * FROM foods WHERE human_food = 1 ORDER BY name');
  const foods = rowsToObjects(result);
  return NextResponse.json(foods);
}
