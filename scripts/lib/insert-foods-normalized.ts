import { Database } from 'sql.js';
import { Food, Plant, Animal, Pesticide, PlantPesticide, AnimalFeed } from '../../lib/types';
import { RawFood, RawPlant, RawAnimal, RawPesticide, RawPlantPesticide, RawAnimalFeed } from './types';

interface NormalizedInsertData {
  foods: Food[];
  plants: Plant[];
  animals: Animal[];
  plantPesticides: PlantPesticide[];
  pesticides: Pesticide[];
  animalFeed: AnimalFeed[];
}

const SQL = `INSERT INTO foods_normalized (
  food_id, is_feed, slug, name, type, tags, human_food,
  calories, fat, sat_fat, protein, fiber,
  yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha,
  fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr,
  pesticide_freshwater_paf, pesticide_terrestrial_paf, pesticide_bee_hazard, pesticide_kg_per_kg_food,
  neuron_count, weight_kg, yield_fraction, pasture_ha_per_kg_output,
  native_fraction, bycatch_amount,
  ch4_kg_per_kg_output, n2o_kg_per_kg_output, co2_kg_per_kg_output
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export function insert(db: Database, { foods, plants, animals, plantPesticides, pesticides, animalFeed }: NormalizedInsertData): void {
  const plantByFoodId = new Map(plants.map(plant => [plant.food_id, plant]));
  const plantByPlantId = new Map(plants.map(plant => [plant.id, plant]));
  const animalByFoodId = new Map(animals.map(animal => [animal.food_id, animal]));
  const pesticideById = new Map(pesticides.map(pesticide => [pesticide.id, new RawPesticide(pesticide)]));

  const plantPesticidesByPlantId = new Map<number, RawPlantPesticide[]>();
  for (const plantPesticide of plantPesticides) {
    const list = plantPesticidesByPlantId.get(plantPesticide.plant_id) ?? [];
    list.push(new RawPlantPesticide(plantPesticide));
    plantPesticidesByPlantId.set(plantPesticide.plant_id, list);
  }

  const feedByAnimalId = new Map<number, RawAnimalFeed[]>();
  for (const feedEntry of animalFeed) {
    const list = feedByAnimalId.get(feedEntry.animal_id) ?? [];
    list.push(new RawAnimalFeed(feedEntry));
    feedByAnimalId.set(feedEntry.animal_id, list);
  }

  const buildRawPlant = (plantData: Plant): RawPlant =>
    new RawPlant(plantData, (plantPesticidesByPlantId.get(plantData.id) ?? []).map(plantPesticide => ({
      plantPesticide,
      pesticide: pesticideById.get(plantPesticide.pesticide_id)!,
    })));

  for (const food of foods) {
    const plantData = plantByFoodId.get(food.id);
    const animalData = animalByFoodId.get(food.id);

    const rawPlant = plantData ? buildRawPlant(plantData) : null;

    const rawAnimal = animalData
      ? new RawAnimal(animalData, (feedByAnimalId.get(animalData.id) ?? []).map(feedEntry => ({
          feed: feedEntry,
          plant: buildRawPlant(plantByPlantId.get(feedEntry.plant_id)!),
        })))
      : null;

    const rawFood = new RawFood(food, rawPlant, rawAnimal);

    db.run(SQL, rawFood.toNormalized().toDbParams());

    const feedRow = rawFood.toFeedNormalized();
    if (feedRow) db.run(SQL, feedRow.toDbParams());
  }
}
