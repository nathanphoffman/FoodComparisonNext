import { Database } from 'sql.js';
import { Source } from '../../lib/types';

export function insert(db: Database, sources: Source[]): void {
  for (const source of sources) {
    db.run(
      'INSERT INTO sources (id, url, title, notes) VALUES (?, ?, ?, ?)',
      [source.id, source.url, source.title, source.notes ? JSON.stringify(source.notes) : null]
    );
  }
}
