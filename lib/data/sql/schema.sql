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
    calories REAL    NOT NULL,  -- kcal/g
    fat      REAL    NOT NULL,
    sat_fat  REAL    NOT NULL,
    protein  REAL    NOT NULL,
    fiber       REAL    NOT NULL,
    human_food  INTEGER NOT NULL DEFAULT 1,  -- boolean: 1 = human food, 0 = feed/forage only
    sources     TEXT                         -- json array of source URLs
);

CREATE TABLE IF NOT EXISTS animals (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id           INTEGER REFERENCES foods(id),
    neuron_count      INTEGER,
    weight_kg         REAL,
    bycatch_animal_id INTEGER REFERENCES animals(id),
    bycatch_amount    REAL,
    sources           TEXT  -- json array of source URLs
);

CREATE TABLE IF NOT EXISTS plants (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id          INTEGER REFERENCES foods(id),
    yield_kg_ha      REAL,  -- kg per hectare
    water_per_kg     REAL,  -- liters per kg
    soil_erosion     REAL,  -- tons/hectare/year
    pesticide_kg_ha  REAL,  -- kg of pesticide per hectare
    fertilizer_kg_ha REAL,  -- kg of fertilizer per hectare
    emissions_per_kg REAL,   -- kg CO2e per kg
    tillage_events_per_year REAL,  -- allows calculation of tillage deaths reversing yield_kg_ha
    co2_capture_kg_ha_yr  REAL,  -- kg CO2 sequestered per hectare per year
    sources               TEXT   -- json array of source URLs
);

CREATE TABLE IF NOT EXISTS plant_animal_kills (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_id     INTEGER NOT NULL REFERENCES plants(id),
    animal_id    INTEGER NOT NULL REFERENCES animals(id),
    kills_per_ha REAL    -- animals of this type killed per hectare
);

CREATE TABLE IF NOT EXISTS animal_feed (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id            INTEGER NOT NULL REFERENCES animals(id),
    plant_id             INTEGER NOT NULL REFERENCES plants(id),
    kg_feed_per_kg_output  REAL    NOT NULL,  -- kg of feed per kg of output (meat, eggs, milk, etc.)
    sources              TEXT    -- json array of source URLs
);

CREATE TABLE IF NOT EXISTS pesticides (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE,
    paf  REAL    NOT NULL  -- potentially affected fraction (0-1)
);

CREATE TABLE IF NOT EXISTS plant_pesticides (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_id      INTEGER NOT NULL REFERENCES plants(id),
    pesticide_id  INTEGER NOT NULL REFERENCES pesticides(id)
);
