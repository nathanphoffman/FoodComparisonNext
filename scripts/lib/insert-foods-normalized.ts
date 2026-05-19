import { Database } from 'sql.js';
import { Food, Plant, Animal, Pesticide, PlantPesticide } from '../../lib/types';
import { RawFood, RawPlant, RawAnimal, RawPesticide, RawPlantPesticide } from './types';

interface NormalizedInsertData {
  foods: Food[];
  plants: Plant[];
  animals: Animal[];
  plantPesticides: PlantPesticide[];
  pesticides: Pesticide[];
}

const SQL = `INSERT INTO foods_normalized (
  id, slug, name, type, tags, human_food,
  calories, fat, sat_fat, protein, fiber,
  yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha,
  fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr,
  pesticide_weighted_paf, pesticide_kg_per_kg_food,
  neuron_count, weight_kg, yield_fraction, pasture_ha_per_kg_output,
  native_fraction, bycatch_amount
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export function insert(db: Database, { foods, plants, animals, plantPesticides, pesticides }: NormalizedInsertData): void {
  const plantByFoodId = new Map(plants.map(p => [p.food_id, p]));
  const animalByFoodId = new Map(animals.map(a => [a.food_id, a]));
  const pesticideById = new Map(pesticides.map(p => [p.id, new RawPesticide(p)]));

  const ppsByPlantId = new Map<number, RawPlantPesticide[]>();
  for (const pp of plantPesticides) {
    const list = ppsByPlantId.get(pp.plant_id) ?? [];
    list.push(new RawPlantPesticide(pp));
    ppsByPlantId.set(pp.plant_id, list);
  }

  for (const food of foods) {
    const plantData = plantByFoodId.get(food.id);
    const animalData = animalByFoodId.get(food.id);

    const rawPlant = plantData
      ? new RawPlant(plantData, (ppsByPlantId.get(plantData.id) ?? []).map(pp => ({
          pp,
          pesticide: pesticideById.get(pp.data.pesticide_id)!,
        })))
      : null;

    const rawAnimal = animalData ? new RawAnimal(animalData) : null;
    const normalized = new RawFood(food, rawPlant, rawAnimal).toNormalized();

    db.run(SQL, normalized.toDbParams());
  }
}
