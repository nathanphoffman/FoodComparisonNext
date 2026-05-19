import { Database } from 'sql.js';
import { PlantPesticide } from '../../lib/types';
import { assertSourcedArray } from './validate';

export function insert(db: Database, plantPesticides: PlantPesticide[]): void {
  for (const plantPesticide of plantPesticides) {
    assertSourcedArray(plantPesticide.kg_ha, `plant_pesticide ${plantPesticide.id}.kg_ha`);
    db.run(
      'INSERT INTO plant_pesticides (id, plant_id, pesticide_id, kg_ha) VALUES (?, ?, ?, ?)',
      [plantPesticide.id, plantPesticide.plant_id, plantPesticide.pesticide_id, plantPesticide.kg_ha ? JSON.stringify(plantPesticide.kg_ha) : null]
    );
  }
}
