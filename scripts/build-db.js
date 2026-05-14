const { readFileSync, writeFileSync, readdirSync, unlinkSync } = require('fs');
const { resolve } = require('path');
const initSqlJs = require('sql.js');

const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'lib/data/json');

function read(filename) {
  return JSON.parse(readFileSync(resolve(dataDir, filename), 'utf8'));
}

function getConfigLines() {
  const configPath = resolve(root, 'next.config.ts');
  const lines = readFileSync(configPath, 'utf8').split('\n');
  return lines;
}

function getDBVersion(lines) {
  // get version from lines
  const idx = lines.findIndex((l) => l.includes('DB_VERSION:'));
  if (idx === -1) throw new Error('DB_VERSION not found in next.config.ts');
  const line = lines[idx];
  return line;
}

function getVersionNumberFromDBVersion(dbVersion) {
  const start = dbVersion.indexOf("'v") + 2;
  const end = dbVersion.indexOf("'", start);
  return parseInt(dbVersion.slice(start, end), 10);
}

function writeNewVersionNumberToConfig(oldDbVersion, newVersion) {

  const start = oldDbVersion.indexOf("'v") + 2;
  const end = oldDbVersion.indexOf("'", start);

  const configPath = resolve(root, 'next.config.ts');
  const configLines = [...getConfigLines()];
  const idx = configLines.findIndex((l) => l.includes('DB_VERSION:'));
  configLines[idx] = configLines[idx].slice(0, start) + newVersion + configLines[idx].slice(end);
  writeFileSync(configPath, configLines.join('\n'));
}

function bumpVersion() {

  const configLines = getConfigLines();
  const dbVersion = getDBVersion(configLines); // format is v#
  const nextDbVersion = getVersionNumberFromDBVersion(dbVersion) + 1;

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

  const sources = read('sources.json');
  const foods = read('foods.json');
  const animals = read('animals.json');
  const plants = read('plants.json');
  const animalFeed = read('animal_feed.json');
  const pesticides = read('pesticides.json');
  const plantKills = read('plant_animal_kills.json');

  for (const s of sources) {
    db.run(
      'INSERT INTO sources (id, url, title, notes) VALUES (?, ?, ?, ?)',
      [s.id, s.url, s.title, s.notes ? JSON.stringify(s.notes) : null]
    );
  }

  for (const f of foods) {
    db.run(
      'INSERT INTO foods (id, slug, name, type, calories, fat, sat_fat, protein, fiber, human_food, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [f.id, f.slug, f.name, f.type, f.calories, f.fat, f.sat_fat, f.protein, f.fiber, f.human_food, f.sources ? JSON.stringify(f.sources) : null]
    );
  }

  for (const a of animals) {
    db.run(
      'INSERT INTO animals (id, food_id, neuron_count, weight_kg, bycatch_animal_id, bycatch_amount, sources) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [a.id, a.food_id, a.neuron_count ?? null, a.weight_kg ?? null, a.bycatch_animal_id ?? null, a.bycatch_amount ?? null, a.sources ? JSON.stringify(a.sources) : null]
    );
  }

  for (const p of plants) {
    db.run(
      'INSERT INTO plants (id, food_id, yield_kg_ha, water_per_kg, soil_erosion, pesticide_kg_ha, fertilizer_kg_ha, emissions_per_kg, tillage_events_per_year, co2_capture_kg_ha_yr, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, p.food_id, p.yield_kg_ha ?? null, p.water_per_kg ?? null, p.soil_erosion ?? null, p.pesticide_kg_ha ?? null, p.fertilizer_kg_ha ?? null, p.emissions_per_kg ?? null, p.tillage_events_per_year ?? null, p.co2_capture_kg_ha_yr ?? null, p.sources ? JSON.stringify(p.sources) : null]
    );
  }

  for (const p of pesticides) {
    db.run(
      'INSERT INTO pesticides (id, name, paf) VALUES (?, ?, ?)',
      [p.id, p.name, p.paf]
    );
  }

  for (const k of plantKills) {
    db.run(
      'INSERT INTO plant_animal_kills (id, plant_id, animal_id, kills_per_ha) VALUES (?, ?, ?, ?)',
      [k.id, k.plant_id, k.animal_id, k.kills_per_ha ?? null]
    );
  }

  for (const af of animalFeed) {
    db.run(
      'INSERT INTO animal_feed (id, animal_id, plant_id, kg_feed_per_kg_output, sources) VALUES (?, ?, ?, ?, ?)',
      [af.id, af.animal_id, af.plant_id, af.kg_feed_per_kg_output, af.sources ? JSON.stringify(af.sources) : null]
    );
  }

  const dataPath = resolve(root, 'lib/data');
  for (const f of readdirSync(dataPath)) {
    if (f.startsWith('foods.v') && f.endsWith('.db')) unlinkSync(resolve(dataPath, f));
  }

  const outPath = resolve(dataPath, `foods.${version}.db`);
  writeFileSync(outPath, Buffer.from(db.export()));

  const stats = require('fs').statSync(outPath);
  console.log(`Built ${outPath} (${stats.size} bytes) — ${version}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
