CREATE TABLE IF NOT EXISTS sources (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    url   TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    notes TEXT  -- json array of note strings
);

CREATE TABLE IF NOT EXISTS foods (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    slug     TEXT    NOT NULL UNIQUE,
    name     TEXT    NOT NULL,
    type     TEXT    NOT NULL,
    nutrition TEXT   NOT NULL,  -- json array of {value: {calories, fat, sat_fat, protein, fiber}, source_id, confidence}
    human_food  INTEGER NOT NULL DEFAULT 1,  -- boolean: 1 = human food, 0 = feed/forage only
    tags        TEXT    NOT NULL DEFAULT '[]' -- json array of string tags, e.g. '["meat","common"]'
);

CREATE TABLE IF NOT EXISTS animals (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id           INTEGER REFERENCES foods(id),
    neuron_count      TEXT,
    weight_kg         TEXT,
    bycatch_animal_id INTEGER REFERENCES animals(id),
    bycatch_amount    TEXT
);

CREATE TABLE IF NOT EXISTS plants (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id          INTEGER REFERENCES foods(id),
    yield_kg_ha             TEXT,  -- json array of {value: kg/ha, source_id}
    water_per_kg            TEXT,  -- json array of {value: liters/kg, source_id}
    soil_erosion            TEXT,  -- json array of {value: tons/ha/yr, source_id}
    pesticide_kg_ha         TEXT,  -- json array of {value: kg/ha, source_id}
    fertilizer_kg_ha        TEXT,  -- json array of {value: kg/ha, source_id}
    emissions_per_kg        TEXT,  -- json array of {value: kg CO2e/kg, source_id}
    tillage_events_per_year TEXT,  -- json array of {value: events/yr, source_id}
    co2_capture_kg_ha_yr    TEXT   -- json array of {value: kg CO2/ha/yr, source_id}
);

CREATE TABLE IF NOT EXISTS plant_animal_kills (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_id     INTEGER NOT NULL REFERENCES plants(id),
    animal_id    INTEGER NOT NULL REFERENCES animals(id),
    kills_per_ha TEXT    -- json array of {value: animals/ha, source_id}
);

CREATE TABLE IF NOT EXISTS animal_feed (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id            INTEGER NOT NULL REFERENCES animals(id),
    plant_id             INTEGER NOT NULL REFERENCES plants(id),
    kg_feed_per_kg_output  TEXT    NOT NULL   -- json array of {value: kg feed/kg output, source_id}
);

CREATE TABLE IF NOT EXISTS pesticides (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE,
    paf  TEXT    NOT NULL  -- json array of {value: 0-1, source_id, confidence}
);

CREATE TABLE IF NOT EXISTS plant_pesticides (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_id      INTEGER NOT NULL REFERENCES plants(id),
    pesticide_id  INTEGER NOT NULL REFERENCES pesticides(id),
    kg_ha         TEXT    -- json array of {value: kg/ha, source_id, confidence}
);
