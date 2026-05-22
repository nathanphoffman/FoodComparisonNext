import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Food, Animal, Plant, AnimalFeed, Pesticide, PlantPesticide, Source, ISourced } from '../lib/types';

// ─── Edit this to assign plant slugs to categories ──────────────────────────
// Animals auto-assign from tags: meat→meats, fish/seafood→seafood, dairy→dairy, egg→eggs.
// human_food=0 items always land in 'feeds'. Unrecognized slugs land in 'other'.
const PLANT_CATEGORY_MAP: Record<string, string> = {
    almonds: 'nuts',          walnuts: 'nuts',       cashews: 'nuts',
    pistachios: 'nuts',       pecans: 'nuts',         hazelnuts: 'nuts',
    'macadamia-nuts': 'nuts', 'brazil-nuts': 'nuts', peanuts: 'nuts',
    'pine-nuts': 'nuts',      'sunflower-seeds': 'nuts',
    wheat: 'grains',  corn: 'grains',  rice: 'grains',  oats: 'grains',
    sorghum: 'grains', barley: 'grains', quinoa: 'grains',
    soy: 'legumes',    lentils: 'legumes', chickpeas: 'legumes', 'black-beans': 'legumes',
    lettuce: 'leafy',  spinach: 'leafy',   kale: 'leafy',
    tomato: 'vegetables',    cucumber: 'vegetables',  potato: 'vegetables',
    broccoli: 'vegetables',  'sweet-potato': 'vegetables', garlic: 'vegetables',
    apple: 'fruits',   banana: 'fruits', avocado: 'fruits',
    mango: 'fruits',   orange: 'fruits', coconut: 'fruits',
    'olive-oil': 'oils',  flaxseed: 'seeds',
};
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'lib/data/json');
const OUT_DIR = resolve(DATA_DIR, 'foods');
const EM_DASH = ' — ';

interface EmbeddedSource {
    id: number;
    url: string;
    title: string;
    note: string | null;
}

interface EnrichedVal {
    value: unknown;
    confidence: number;
    source: EmbeddedSource;
}

function readJson<T>(filename: string): T {
    return JSON.parse(readFileSync(resolve(DATA_DIR, filename), 'utf8')) as T;
}

function resolveNote(src: Source, foodName: string, field: string): string | null {
    if (!src.notes?.length) return null;
    return (
        src.notes.find(n => n.startsWith(foodName + EM_DASH) && n.includes(field)) ??
        src.notes.find(n => n.startsWith(foodName + EM_DASH)) ??
        src.notes.find(n => n.startsWith('All foods' + EM_DASH) && n.includes(field)) ??
        src.notes.find(n => n.startsWith('All foods' + EM_DASH)) ??
        null
    );
}

function enrich<T>(v: ISourced<T>, srcMap: Map<number, Source>, food: string, field: string): EnrichedVal {
    const src = srcMap.get(v.source_id)!;
    return {
        value: v.value,
        confidence: v.confidence,
        source: { id: src.id, url: src.url, title: src.title, note: resolveNote(src, food, field) },
    };
}

function enrichArr<T>(
    arr: ISourced<T>[] | null | undefined,
    srcMap: Map<number, Source>,
    food: string,
    field: string
): EnrichedVal[] | null {
    if (!arr?.length) return null;
    return arr.map(v => enrich(v, srcMap, food, field));
}

function assignCategory(food: Food): string {
    if (!food.human_food) return 'feeds';
    if (food.type === 'animal') {
        if (food.tags.includes('meat')) return 'meats';
        if (food.tags.includes('fish') || food.tags.includes('seafood')) return 'seafood';
        if (food.tags.includes('dairy')) return 'dairy';
        if (food.slug === 'egg') return 'eggs';
        return 'other';
    }
    return PLANT_CATEGORY_MAP[food.slug] ?? 'other';
}

function buildFeed(
    animal: Animal,
    allFeed: AnimalFeed[],
    plantById: Map<number, Plant>,
    foodById: Map<number, Food>,
    srcMap: Map<number, Source>,
    foodName: string
): object[] {
    return allFeed
        .filter(af => af.animal_id === animal.id)
        .map(af => {
            const plantFood = foodById.get(plantById.get(af.plant_id)!.food_id)!;
            return {
                food_id: plantFood.id,
                food_slug: plantFood.slug,
                kg_feed_per_kg_output: enrichArr(af.kg_feed_per_kg_output, srcMap, foodName, 'kg_feed_per_kg_output'),
            };
        });
}

function buildAnimalFood(
    food: Food,
    animal: Animal,
    allFeed: AnimalFeed[],
    animalById: Map<number, Animal>,
    plantById: Map<number, Plant>,
    foodById: Map<number, Food>,
    srcMap: Map<number, Source>
): Record<string, unknown> {
    const e = (arr: ISourced<number>[] | null | undefined, f: string) => enrichArr(arr, srcMap, food.name, f);
    const bycatchFood = animal.bycatch_animal_id
        ? (foodById.get(animalById.get(animal.bycatch_animal_id)!.food_id) ?? null)
        : null;
    return {
        id: food.id, slug: food.slug, name: food.name,
        type: food.type, category: assignCategory(food),
        human_food: food.human_food, tags: food.tags,
        nutrition: enrichArr(food.nutrition, srcMap, food.name, 'nutrition'),
        neuron_count: e(animal.neuron_count, 'neuron_count'),
        weight_kg: e(animal.weight_kg, 'weight_kg'),
        yield_fraction: e(animal.yield_fraction, 'yield_fraction'),
        bycatch_food_id: bycatchFood?.id ?? null,
        bycatch_food_slug: bycatchFood?.slug ?? null,
        bycatch_amount: e(animal.bycatch_amount, 'bycatch_amount'),
        pasture_ha_per_kg_output: e(animal.pasture_ha_per_kg_output, 'pasture_ha_per_kg_output'),
        pasture_green_water_l_per_ha: e(animal.pasture_green_water_l_per_ha, 'pasture_green_water_l_per_ha'),
        native_fraction: e(animal.native_fraction, 'native_fraction'),
        ch4_kg_per_kg_output: e(animal.ch4_kg_per_kg_output, 'ch4_kg_per_kg_output'),
        n2o_kg_per_kg_output: e(animal.n2o_kg_per_kg_output, 'n2o_kg_per_kg_output'),
        co2_kg_per_kg_output: e(animal.co2_kg_per_kg_output, 'co2_kg_per_kg_output'),
        feed: buildFeed(animal, allFeed, plantById, foodById, srcMap, food.name),
    };
}

function buildPlantFood(
    food: Food,
    plant: Plant,
    allPP: PlantPesticide[],
    pesticideMap: Map<number, Pesticide>,
    srcMap: Map<number, Source>
): Record<string, unknown> {
    const e = (arr: ISourced<number>[] | null | undefined, f: string) => enrichArr(arr, srcMap, food.name, f);
    const pesticides = allPP
        .filter(pp => pp.plant_id === plant.id)
        .map(pp => ({
            pesticide_id: pp.pesticide_id,
            name: pesticideMap.get(pp.pesticide_id)!.name,
            kg_ha: e(pp.kg_ha, 'kg_ha'),
        }));
    return {
        id: food.id, slug: food.slug, name: food.name,
        type: food.type, category: assignCategory(food),
        human_food: food.human_food, tags: food.tags,
        nutrition: enrichArr(food.nutrition, srcMap, food.name, 'nutrition'),
        yield_fraction: e(plant.yield_fraction, 'yield_fraction'),
        yield_kg_ha: e(plant.yield_kg_ha, 'yield_kg_ha'),
        water_per_kg: e(plant.water_per_kg, 'water_per_kg'),
        green_water_per_kg: e(plant.green_water_per_kg, 'green_water_per_kg'),
        blue_water_per_kg: e(plant.blue_water_per_kg, 'blue_water_per_kg'),
        grey_water_per_kg: e(plant.grey_water_per_kg, 'grey_water_per_kg'),
        soil_erosion: e(plant.soil_erosion, 'soil_erosion'),
        pesticide_kg_ha: e(plant.pesticide_kg_ha, 'pesticide_kg_ha'),
        fertilizer_kg_ha: e(plant.fertilizer_kg_ha, 'fertilizer_kg_ha'),
        emissions_per_kg: e(plant.emissions_per_kg, 'emissions_per_kg'),
        tillage_events_per_year: e(plant.tillage_events_per_year, 'tillage_events_per_year'),
        co2_capture_kg_ha_yr: e(plant.co2_capture_kg_ha_yr, 'co2_capture_kg_ha_yr'),
        pesticides,
    };
}

function writeOutput(grouped: Map<string, object[]>): void {
    if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
    const index: Record<string, string[]> = {};
    for (const [category, items] of grouped) {
        writeFileSync(resolve(OUT_DIR, `${category}.json`), JSON.stringify(items, null, 4));
        index[category] = (items as Record<string, string>[]).map(f => f.slug);
    }
    writeFileSync(resolve(OUT_DIR, 'index.json'), JSON.stringify(index, null, 4));
}

function printSummary(grouped: Map<string, object[]>): void {
    const total = [...grouped.values()].reduce((n, arr) => n + arr.length, 0);
    console.log(`\nWrote ${total} foods across ${grouped.size} categories → ${OUT_DIR}/`);
    for (const [cat, items] of [...grouped].sort(([a], [b]) => a.localeCompare(b))) {
        const slugs = (items as Record<string, string>[]).map(f => f.slug).join(', ');
        console.log(`  ${cat}.json (${items.length}): ${slugs}`);
    }
    const other = grouped.get('other') ?? [];
    if (other.length) {
        console.warn(`\n⚠  ${other.length} food(s) landed in 'other' — add them to PLANT_CATEGORY_MAP:`);
        (other as Record<string, string>[]).forEach(f => console.warn(`    ${f.slug}`));
    }
}

function main(): void {
    const foods        = readJson<Food[]>('foods.json');
    const animals      = readJson<Animal[]>('animals.json');
    const plants       = readJson<Plant[]>('plants.json');
    const animalFeed   = readJson<AnimalFeed[]>('animal_feed.json');
    const pesticides   = readJson<Pesticide[]>('pesticides.json');
    const plantPest    = readJson<PlantPesticide[]>('plant_pesticides.json');
    const sources      = readJson<Source[]>('sources.json');

    const srcMap        = new Map(sources.map(s => [s.id, s]));
    const foodById      = new Map(foods.map(f => [f.id, f]));
    const animalById    = new Map(animals.map(a => [a.id, a]));
    const animalByFood  = new Map(animals.map(a => [a.food_id, a]));
    const plantById     = new Map(plants.map(p => [p.id, p]));
    const plantByFood   = new Map(plants.map(p => [p.food_id, p]));
    const pesticideMap  = new Map(pesticides.map(p => [p.id, p]));

    const grouped = new Map<string, object[]>();
    for (const food of foods) {
        const category = assignCategory(food);
        const built = food.type === 'animal'
            ? buildAnimalFood(food, animalByFood.get(food.id)!, animalFeed, animalById, plantById, foodById, srcMap)
            : buildPlantFood(food, plantByFood.get(food.id)!, plantPest, pesticideMap, srcMap);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category)!.push(built);
    }

    writeOutput(grouped);
    printSummary(grouped);
}

main();
