import { Database } from 'sql.js';
import { Animal } from '../../lib/types';
import { assertSourcedArray } from './validate';

export function insert(db: Database, animals: Animal[]): void {
  for (const animal of animals) {
    const id = `animal ${animal.id}`;
    assertSourcedArray(animal.neuron_count, `${id}.neuron_count`);
    assertSourcedArray(animal.weight_kg, `${id}.weight_kg`);
    assertSourcedArray(animal.bycatch_amount, `${id}.bycatch_amount`);
    assertSourcedArray(animal.yield_fraction, `${id}.yield_fraction`);
    assertSourcedArray(animal.pasture_ha_per_kg_output, `${id}.pasture_ha_per_kg_output`);
    assertSourcedArray(animal.native_fraction, `${id}.native_fraction`);
    db.run(
      'INSERT INTO animals (id, food_id, neuron_count, weight_kg, bycatch_animal_id, bycatch_amount, yield_fraction, pasture_ha_per_kg_output, native_fraction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        animal.id, animal.food_id,
        animal.neuron_count ? JSON.stringify(animal.neuron_count) : null,
        animal.weight_kg ? JSON.stringify(animal.weight_kg) : null,
        animal.bycatch_animal_id ?? null,
        animal.bycatch_amount ? JSON.stringify(animal.bycatch_amount) : null,
        animal.yield_fraction ? JSON.stringify(animal.yield_fraction) : null,
        animal.pasture_ha_per_kg_output ? JSON.stringify(animal.pasture_ha_per_kg_output) : null,
        animal.native_fraction ? JSON.stringify(animal.native_fraction) : null,
      ]
    );
  }
}
