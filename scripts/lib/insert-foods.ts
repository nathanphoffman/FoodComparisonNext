import { Database } from 'sql.js';
import { Food } from '../../lib/types';

export function insert(db: Database, foods: Food[]): void {
  for (const food of foods) {
    db.run(
      'INSERT INTO foods (id, slug, name, type, nutrition, human_food, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [food.id, food.slug, food.name, food.type, JSON.stringify(food.nutrition), food.human_food, JSON.stringify(food.tags ?? [])]
    );
  }
}
