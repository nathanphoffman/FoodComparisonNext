import { Database } from 'sql.js';
import { Animal } from '../../lib/types';
import { assertSourcedArray } from './validate';

export function insert(db: Database, animals: Animal[]): void {
  for (const animal of animals) {
    const label = `animal ${animal.id}`;
    assertSourcedArray(animal.neuron_count, `${label}.neuron_count`);
    assertSourcedArray(animal.weight_kg, `${label}.weight_kg`);
    assertSourcedArray(animal.bycatch_amount, `${label}.bycatch_amount`);
    assertSourcedArray(animal.yield_fraction, `${label}.yield_fraction`);
    assertSourcedArray(animal.pasture_ha_per_kg_output, `${label}.pasture_ha_per_kg_output`);
    assertSourcedArray(animal.native_fraction, `${label}.native_fraction`);
    db.run(
      `INSERT INTO animals (
        id, food_id, neuron_count, weight_kg, bycatch_animal_id, bycatch_amount,
        yield_fraction, pasture_ha_per_kg_output, native_fraction,
        ch4_kg_per_kg_output, n2o_kg_per_kg_output, co2_kg_per_kg_output
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        animal.id, animal.food_id,
        animal.neuron_count ? JSON.stringify(animal.neuron_count) : null,
        animal.weight_kg ? JSON.stringify(animal.weight_kg) : null,
        animal.bycatch_animal_id ?? null,
        animal.bycatch_amount ? JSON.stringify(animal.bycatch_amount) : null,
        animal.yield_fraction ? JSON.stringify(animal.yield_fraction) : null,
        animal.pasture_ha_per_kg_output ? JSON.stringify(animal.pasture_ha_per_kg_output) : null,
        animal.native_fraction ? JSON.stringify(animal.native_fraction) : null,
        animal.ch4_kg_per_kg_output ? JSON.stringify(animal.ch4_kg_per_kg_output) : null,
        animal.n2o_kg_per_kg_output ? JSON.stringify(animal.n2o_kg_per_kg_output) : null,
        animal.co2_kg_per_kg_output ? JSON.stringify(animal.co2_kg_per_kg_output) : null,
      ]
    );
  }
}
