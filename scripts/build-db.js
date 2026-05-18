const { readFileSync, writeFileSync, readdirSync, unlinkSync, statSync } = require('fs');
const { resolve } = require('path');
const initSqlJs = require('sql.js');

const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'lib/data/json');

function readJsonFile(filename) {
  return JSON.parse(readFileSync(resolve(dataDir, filename), 'utf8'));
}

function getConfigLines() {
  const configPath = resolve(root, 'next.config.ts');
  const lines = readFileSync(configPath, 'utf8').split('\n');
  return lines;
}

function getDatabaseVersion(lines) {
  const idx = lines.findIndex((line) => line.includes('DB_VERSION:'));
  if (idx === -1) throw new Error('DB_VERSION not found in next.config.ts');
  return lines[idx];
}

function getVersionNumberFromDatabaseVersion(dbVersion) {
  const start = dbVersion.indexOf("'v") + 2;
  const end = dbVersion.indexOf("'", start);
  return parseInt(dbVersion.slice(start, end), 10);
}

function writeNewVersionNumberToConfig(oldDbVersion, newVersion) {

  const start = oldDbVersion.indexOf("'v") + 2;
  const end = oldDbVersion.indexOf("'", start);

  const configPath = resolve(root, 'next.config.ts');
  const configLines = [...getConfigLines()];
  const idx = configLines.findIndex((line) => line.includes('DB_VERSION:'));
  configLines[idx] = configLines[idx].slice(0, start) + newVersion + configLines[idx].slice(end);
  writeFileSync(configPath, configLines.join('\n'));
}

function bumpVersion() {

  const configLines = getConfigLines();
  const dbVersion = getDatabaseVersion(configLines); // format is v#
  const nextDbVersion = getVersionNumberFromDatabaseVersion(dbVersion) + 1;

  writeNewVersionNumberToConfig(dbVersion, nextDbVersion);

  return `v${nextDbVersion}`;
}

async function main() {
  const version = bumpVersion();
  const SQL = await initSqlJs({
    locateFile: (file) => resolve(root, 'node_modules/sql.js/dist', file),
  });

  const db = new SQL.Database();

  const schema = readFileSync(resolve(root, 'lib/data/sql/schema.sql'), 'utf8');
  db.run(schema);

  const sources = readJsonFile('sources.json');
  const foods = readJsonFile('foods.json');
  const animals = readJsonFile('animals.json');
  const plants = readJsonFile('plants.json');
  const animalFeed = readJsonFile('animal_feed.json');
  const pesticides = readJsonFile('pesticides.json');
  const plantKills = readJsonFile('plant_animal_kills.json');
  const plantPesticides = readJsonFile('plant_pesticides.json');

  for (const source of sources) {
    db.run(
      'INSERT INTO sources (id, url, title, notes) VALUES (?, ?, ?, ?)',
      [source.id, source.url, source.title, source.notes ? JSON.stringify(source.notes) : null]
    );
  }

  for (const food of foods) {
    db.run(
      'INSERT INTO foods (id, slug, name, type, nutrition, human_food, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [food.id, food.slug, food.name, food.type, JSON.stringify(food.nutrition), food.human_food, JSON.stringify(food.tags ?? [])]
    );
  }

  for (const animal of animals) {
    db.run(
      'INSERT INTO animals (id, food_id, neuron_count, weight_kg, bycatch_animal_id, bycatch_amount, yield_fraction) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [animal.id, animal.food_id, animal.neuron_count ? JSON.stringify(animal.neuron_count) : null, animal.weight_kg ? JSON.stringify(animal.weight_kg) : null, animal.bycatch_animal_id ?? null, animal.bycatch_amount ? JSON.stringify(animal.bycatch_amount) : null, animal.yield_fraction ? JSON.stringify(animal.yield_fraction) : null]
    );
  }

  for (const plant of plants) {
    db.run(
      'INSERT INTO plants (id, food_id, yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha, fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [plant.id, plant.food_id, plant.yield_kg_ha ? JSON.stringify(plant.yield_kg_ha) : null, plant.water_per_kg ? JSON.stringify(plant.water_per_kg) : null, plant.soil_erosion ? JSON.stringify(plant.soil_erosion) : null, plant.pesticide_kg_ha ? JSON.stringify(plant.pesticide_kg_ha) : null, plant.fertilizer_kg_ha ? JSON.stringify(plant.fertilizer_kg_ha) : null, plant.emissions_per_kg ? JSON.stringify(plant.emissions_per_kg) : null, plant.tillage_events_per_year ? JSON.stringify(plant.tillage_events_per_year) : null, plant.co2_capture_kg_ha_yr ? JSON.stringify(plant.co2_capture_kg_ha_yr) : null]
    );
  }

  for (const pesticide of pesticides) {
    db.run(
      'INSERT INTO pesticides (id, name, paf) VALUES (?, ?, ?)',
      [pesticide.id, pesticide.name, JSON.stringify(pesticide.paf)]
    );
  }

  for (const plantKill of plantKills) {
    db.run(
      'INSERT INTO plant_animal_kills (id, plant_id, animal_id, kills_per_ha) VALUES (?, ?, ?, ?)',
      [plantKill.id, plantKill.plant_id, plantKill.animal_id, plantKill.kills_per_ha ? JSON.stringify(plantKill.kills_per_ha) : null]
    );
  }

  for (const plantPesticide of plantPesticides) {
    db.run(
      'INSERT INTO plant_pesticides (id, plant_id, pesticide_id, kg_ha) VALUES (?, ?, ?, ?)',
      [plantPesticide.id, plantPesticide.plant_id, plantPesticide.pesticide_id, plantPesticide.kg_ha ? JSON.stringify(plantPesticide.kg_ha) : null]
    );
  }

  for (const animalFeedEntry of animalFeed) {
    db.run(
      'INSERT INTO animal_feed (id, animal_id, plant_id, kg_feed_per_kg_output) VALUES (?, ?, ?, ?)',
      [animalFeedEntry.id, animalFeedEntry.animal_id, animalFeedEntry.plant_id, JSON.stringify(animalFeedEntry.kg_feed_per_kg_output)]
    );
  }

  const dataPath = resolve(root, 'lib/data');
  for (const filename of readdirSync(dataPath)) {
    if (filename.startsWith('foods.v') && filename.endsWith('.db')) unlinkSync(resolve(dataPath, filename));
  }

  const outPath = resolve(dataPath, `foods.${version}.db`);
  writeFileSync(outPath, Buffer.from(db.export()));

  const stats = statSync(outPath);
  console.log(`Built ${outPath} (${stats.size} bytes) — ${version}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
