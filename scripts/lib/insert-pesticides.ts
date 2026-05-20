import { Database } from 'sql.js';
import { Pesticide } from '../../lib/types';

export function insert(db: Database, pesticides: Pesticide[]): void {
  for (const pesticide of pesticides) {
    db.run(
      'INSERT INTO pesticides (id, name, freshwater_paf, terrestrial_paf, insect_paf, bee_ld50) VALUES (?, ?, ?, ?, ?, ?)',
      [
        pesticide.id,
        pesticide.name,
        JSON.stringify(pesticide.freshwater_paf),
        pesticide.terrestrial_paf ? JSON.stringify(pesticide.terrestrial_paf) : null,
        pesticide.insect_paf ? JSON.stringify(pesticide.insect_paf) : null,
        pesticide.bee_ld50 ? JSON.stringify(pesticide.bee_ld50) : null,
      ]
    );
  }
}
