import { Database } from 'sql.js';
import { PlantAnimalKill } from '../../lib/types';
import { assertSourcedArray } from './validate';

export function insert(db: Database, plantKills: PlantAnimalKill[]): void {
  for (const plantKill of plantKills) {
    assertSourcedArray(plantKill.kills_per_ha, `plant_animal_kill ${plantKill.id}.kills_per_ha`);
    db.run(
      'INSERT INTO plant_animal_kills (id, plant_id, animal_id, kills_per_ha) VALUES (?, ?, ?, ?)',
      [plantKill.id, plantKill.plant_id, plantKill.animal_id, plantKill.kills_per_ha ? JSON.stringify(plantKill.kills_per_ha) : null]
    );
  }
}
