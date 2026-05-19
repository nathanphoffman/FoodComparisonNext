import { readFileSync, writeFileSync, readdirSync, unlinkSync, statSync } from 'fs';
import { resolve } from 'path';
import initSqlJs from 'sql.js';
import { Food, Animal, Plant, AnimalFeed, Pesticide, PlantAnimalKill, PlantPesticide, Source } from '../lib/types';

import { insert as insertSources }         from './lib/insert-sources';
import { insert as insertFoods }           from './lib/insert-foods';
import { insert as insertAnimals }         from './lib/insert-animals';
import { insert as insertPlants }          from './lib/insert-plants';
import { insert as insertPesticides }      from './lib/insert-pesticides';
import { insert as insertPlantKills }      from './lib/insert-plant-animal-kills';
import { insert as insertPlantPesticides } from './lib/insert-plant-pesticides';
import { insert as insertAnimalFeed }      from './lib/insert-animal-feed';
import { insert as insertFoodsNormalized } from './lib/insert-foods-normalized';

const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'lib/data/json');

function readJsonFile<T>(filename: string): T {
  return JSON.parse(readFileSync(resolve(dataDir, filename), 'utf8')) as T;
}

function getConfigLines(): string[] {
  return readFileSync(resolve(root, 'next.config.ts'), 'utf8').split('\n');
}

function bumpVersion(): string {
  const configLines = getConfigLines();
  const idx = configLines.findIndex((line) => line.includes('DB_VERSION:'));
  if (idx === -1) throw new Error('DB_VERSION not found in next.config.ts');

  const line = configLines[idx];
  const start = line.indexOf("'v") + 2;
  const end = line.indexOf("'", start);
  const nextVersion = parseInt(line.slice(start, end), 10) + 1;

  configLines[idx] = line.slice(0, start) + nextVersion + line.slice(end);
  writeFileSync(resolve(root, 'next.config.ts'), configLines.join('\n'));

  return `v${nextVersion}`;
}

function deleteOldDbs(dataPath: string, prefix: string): void {
  for (const filename of readdirSync(dataPath)) {
    if (filename.startsWith(prefix) && filename.endsWith('.db')) {
      unlinkSync(resolve(dataPath, filename));
    }
  }
}

async function main(): Promise<void> {
  const version = bumpVersion();

  const SQL = await initSqlJs({
    locateFile: (file) => resolve(root, 'node_modules/sql.js/dist', file),
  });

  const sourceDb = new SQL.Database();
  const normalizedDb = new SQL.Database();

  sourceDb.run(readFileSync(resolve(root, 'lib/data/sql/schema.sql'), 'utf8'));
  normalizedDb.run(readFileSync(resolve(root, 'lib/data/sql/schema-normalized.sql'), 'utf8'));

  const sources         = readJsonFile<Source[]>('sources.json');
  const foods           = readJsonFile<Food[]>('foods.json');
  const animals         = readJsonFile<Animal[]>('animals.json');
  const plants          = readJsonFile<Plant[]>('plants.json');
  const animalFeed      = readJsonFile<AnimalFeed[]>('animal_feed.json');
  const pesticides      = readJsonFile<Pesticide[]>('pesticides.json');
  const plantKills      = readJsonFile<PlantAnimalKill[]>('plant_animal_kills.json');
  const plantPesticides = readJsonFile<PlantPesticide[]>('plant_pesticides.json');

  // Tier 1 — no FKs
  insertSources(sourceDb, sources);
  insertPesticides(sourceDb, pesticides);
  // Tier 2
  insertFoods(sourceDb, foods);
  // Tier 3
  insertAnimals(sourceDb, animals);
  insertPlants(sourceDb, plants);
  // Tier 4
  insertPlantKills(sourceDb, plantKills);
  insertPlantPesticides(sourceDb, plantPesticides);
  insertAnimalFeed(sourceDb, animalFeed);
  // Tier 5 — normalized DB, must be last
  insertFoodsNormalized(normalizedDb, { foods, plants, animals, plantPesticides, pesticides, animalFeed });

  const dataPath = resolve(root, 'lib/data');
  deleteOldDbs(dataPath, 'foods.v');
  deleteOldDbs(dataPath, 'foods-normalized.v');

  const sourcePath = resolve(dataPath, `foods.${version}.db`);
  const normalizedPath = resolve(dataPath, `foods-normalized.${version}.db`);

  writeFileSync(sourcePath, Buffer.from(sourceDb.export()));
  writeFileSync(normalizedPath, Buffer.from(normalizedDb.export()));

  console.log(`Built ${sourcePath} (${statSync(sourcePath).size} bytes) — ${version}`);
  console.log(`Built ${normalizedPath} (${statSync(normalizedPath).size} bytes) — ${version}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
