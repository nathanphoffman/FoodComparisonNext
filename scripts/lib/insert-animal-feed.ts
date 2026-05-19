import { Database } from 'sql.js';
import { AnimalFeed } from '../../lib/types';

export function insert(db: Database, animalFeed: AnimalFeed[]): void {
  for (const entry of animalFeed) {
    db.run(
      'INSERT INTO animal_feed (id, animal_id, plant_id, kg_feed_per_kg_output) VALUES (?, ?, ?, ?)',
      [entry.id, entry.animal_id, entry.plant_id, JSON.stringify(entry.kg_feed_per_kg_output)]
    );
  }
}
