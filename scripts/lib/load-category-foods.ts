import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { Food, Animal, Plant, AnimalFeed, PlantAnimalKill, PlantPesticide, ISourced, NutritionValue } from '../../lib/types';

interface SourceRef {
    id: number;
    url: string;
    title: string;
    note: string | null;
}

interface CategorySourced<T> {
    value: T;
    confidence: number;
    source: SourceRef;
}

interface CategoryFeedEntry {
    food_id: number;
    food_slug: string;
    kg_feed_per_kg_output: CategorySourced<number>[];
}

interface CategoryPesticideEntry {
    pesticide_id: number;
    name: string;
    kg_ha: CategorySourced<number>[];
}

interface CategoryFood {
    id: number;
    slug: string;
    name: string;
    type: 'plant' | 'animal';
    category: string;
    human_food: 0 | 1;
    tags: string[];
    nutrition: CategorySourced<NutritionValue>[];
    // plant fields
    yield_fraction?: CategorySourced<number>[] | null;
    yield_kg_ha?: CategorySourced<number>[] | null;
    water_per_kg?: CategorySourced<number>[] | null;
    green_water_per_kg?: CategorySourced<number>[] | null;
    blue_water_per_kg?: CategorySourced<number>[] | null;
    grey_water_per_kg?: CategorySourced<number>[] | null;
    soil_erosion?: CategorySourced<number>[] | null;
    pesticide_kg_ha?: CategorySourced<number>[] | null;
    fertilizer_kg_ha?: CategorySourced<number>[] | null;
    emissions_per_kg?: CategorySourced<number>[] | null;
    tillage_events_per_year?: CategorySourced<number>[] | null;
    co2_capture_kg_ha_yr?: CategorySourced<number>[] | null;
    pesticides?: CategoryPesticideEntry[];
    // animal fields
    neuron_count?: CategorySourced<number>[] | null;
    weight_kg?: CategorySourced<number>[] | null;
    bycatch_food_id?: number | null;
    bycatch_food_slug?: string | null;
    bycatch_amount?: CategorySourced<number>[] | null;
    pasture_ha_per_kg_output?: CategorySourced<number>[] | null;
    pasture_green_water_l_per_ha?: CategorySourced<number>[] | null;
    native_fraction?: CategorySourced<number>[] | null;
    ch4_kg_per_kg_output?: CategorySourced<number>[] | null;
    n2o_kg_per_kg_output?: CategorySourced<number>[] | null;
    co2_kg_per_kg_output?: CategorySourced<number>[] | null;
    feed?: CategoryFeedEntry[];
}

export interface CategoryFoodsResult {
    foods: Food[];
    animals: Animal[];
    plants: Plant[];
    animalFeed: AnimalFeed[];
    plantPesticides: PlantPesticide[];
    plantKills: PlantAnimalKill[];
}

function convertSourced<T>(arr: CategorySourced<T>[] | null | undefined): ISourced<T>[] | null {
    if (!arr || arr.length === 0) return null;
    return arr.map(({ value, confidence, source }) => ({ value, confidence, source_id: source.id }));
}

function convertSourcedRequired<T>(arr: CategorySourced<T>[]): ISourced<T>[] {
    return arr.map(({ value, confidence, source }) => ({ value, confidence, source_id: source.id }));
}

export function loadCategoryFoods(dataDir: string): CategoryFoodsResult {
    const foodsDir = resolve(dataDir, 'foods');
    const files = readdirSync(foodsDir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .sort();

    const allEntries: CategoryFood[] = [];
    for (const file of files) {
        const entries = JSON.parse(readFileSync(resolve(foodsDir, file), 'utf8')) as CategoryFood[];
        allEntries.push(...entries);
    }

    allEntries.sort((a, b) => a.id - b.id);

    const foods: Food[] = [];
    const animals: Animal[] = [];
    const plants: Plant[] = [];
    const animalFeed: AnimalFeed[] = [];
    const plantPesticides: PlantPesticide[] = [];

    let feedId = 1;
    let ppId = 1;

    for (const entry of allEntries) {
        foods.push({
            id: entry.id,
            slug: entry.slug,
            name: entry.name,
            type: entry.type,
            nutrition: convertSourcedRequired(entry.nutrition),
            human_food: entry.human_food,
            tags: entry.tags,
        });

        if (entry.type === 'plant') {
            plants.push({
                id: entry.id,
                food_id: entry.id,
                yield_kg_ha: convertSourced(entry.yield_kg_ha),
                yield_fraction: convertSourced(entry.yield_fraction),
                water_per_kg: convertSourced(entry.water_per_kg),
                green_water_per_kg: convertSourced(entry.green_water_per_kg),
                blue_water_per_kg: convertSourced(entry.blue_water_per_kg),
                grey_water_per_kg: convertSourced(entry.grey_water_per_kg),
                soil_erosion: convertSourced(entry.soil_erosion),
                pesticide_kg_ha: convertSourced(entry.pesticide_kg_ha),
                fertilizer_kg_ha: convertSourced(entry.fertilizer_kg_ha),
                emissions_per_kg: convertSourced(entry.emissions_per_kg),
                tillage_events_per_year: convertSourced(entry.tillage_events_per_year),
                co2_capture_kg_ha_yr: convertSourced(entry.co2_capture_kg_ha_yr),
            });

            for (const pp of (entry.pesticides ?? [])) {
                const kg_ha = convertSourced(pp.kg_ha);
                if (kg_ha) {
                    plantPesticides.push({
                        id: ppId++,
                        plant_id: entry.id,
                        pesticide_id: pp.pesticide_id,
                        kg_ha,
                    });
                }
            }
        }

        if (entry.type === 'animal') {
            animals.push({
                id: entry.id,
                food_id: entry.id,
                neuron_count: convertSourced(entry.neuron_count),
                weight_kg: convertSourced(entry.weight_kg),
                bycatch_animal_id: entry.bycatch_food_id ?? null,
                bycatch_amount: convertSourced(entry.bycatch_amount),
                yield_fraction: convertSourced(entry.yield_fraction),
                pasture_ha_per_kg_output: convertSourced(entry.pasture_ha_per_kg_output),
                pasture_green_water_l_per_ha: convertSourced(entry.pasture_green_water_l_per_ha),
                native_fraction: convertSourced(entry.native_fraction),
                ch4_kg_per_kg_output: convertSourced(entry.ch4_kg_per_kg_output),
                n2o_kg_per_kg_output: convertSourced(entry.n2o_kg_per_kg_output),
                co2_kg_per_kg_output: convertSourced(entry.co2_kg_per_kg_output),
            });

            for (const feedEntry of (entry.feed ?? [])) {
                animalFeed.push({
                    id: feedId++,
                    animal_id: entry.id,
                    plant_id: feedEntry.food_id,
                    kg_feed_per_kg_output: convertSourcedRequired(feedEntry.kg_feed_per_kg_output),
                });
            }
        }
    }

    return { foods, animals, plants, animalFeed, plantPesticides, plantKills: [] };
}
