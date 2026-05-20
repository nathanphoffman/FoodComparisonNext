import { Database } from 'sql.js';
import { Plant } from '../../lib/types';
import { assertSourcedArray } from './validate';

export function insert(db: Database, plants: Plant[]): void {
  for (const plant of plants) {
    const label = `plant ${plant.id}`;
    assertSourcedArray(plant.yield_kg_ha, `${label}.yield_kg_ha`);
    assertSourcedArray(plant.water_per_kg, `${label}.water_per_kg`);
    assertSourcedArray(plant.soil_erosion, `${label}.soil_erosion`);
    assertSourcedArray(plant.pesticide_kg_ha, `${label}.pesticide_kg_ha`);
    assertSourcedArray(plant.fertilizer_kg_ha, `${label}.fertilizer_kg_ha`);
    assertSourcedArray(plant.emissions_per_kg, `${label}.emissions_per_kg`);
    assertSourcedArray(plant.tillage_events_per_year, `${label}.tillage_events_per_year`);
    assertSourcedArray(plant.co2_capture_kg_ha_yr, `${label}.co2_capture_kg_ha_yr`);
    db.run(
      'INSERT INTO plants (id, food_id, yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha, fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        plant.id, plant.food_id,
        plant.yield_kg_ha ? JSON.stringify(plant.yield_kg_ha) : null,
        plant.water_per_kg ? JSON.stringify(plant.water_per_kg) : null,
        plant.soil_erosion ? JSON.stringify(plant.soil_erosion) : null,
        plant.pesticide_kg_ha ? JSON.stringify(plant.pesticide_kg_ha) : null,
        plant.fertilizer_kg_ha ? JSON.stringify(plant.fertilizer_kg_ha) : null,
        plant.emissions_per_kg ? JSON.stringify(plant.emissions_per_kg) : null,
        plant.tillage_events_per_year ? JSON.stringify(plant.tillage_events_per_year) : null,
        plant.co2_capture_kg_ha_yr ? JSON.stringify(plant.co2_capture_kg_ha_yr) : null,
      ]
    );
  }
}
