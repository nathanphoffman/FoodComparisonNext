import { Database } from 'sql.js';
import { Pesticide } from '../../lib/types';

export function insert(db: Database, pesticides: Pesticide[]): void {
  for (const pesticide of pesticides) {
    db.run(
      'INSERT INTO pesticides (id, name, paf) VALUES (?, ?, ?)',
      [pesticide.id, pesticide.name, JSON.stringify(pesticide.paf)]
    );
  }
}
