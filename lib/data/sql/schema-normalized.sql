CREATE TABLE IF NOT EXISTS foods_normalized (
    id                       INTEGER PRIMARY KEY,
    slug                     TEXT    NOT NULL UNIQUE,
    name                     TEXT    NOT NULL,
    type                     TEXT    NOT NULL,   -- 'plant' | 'animal'
    tags                     TEXT    NOT NULL,   -- json array of strings
    human_food               INTEGER NOT NULL,   -- boolean

    -- nutrition averages (all foods)
    calories                 REAL,
    fat                      REAL,
    sat_fat                  REAL,
    protein                  REAL,
    fiber                    REAL,

    -- plant averages (NULL for animal foods)
    yield_kg_ha              REAL,
    water_per_kg             REAL,
    soil_erosion             REAL,
    pesticide_kg_ha          REAL,
    fertilizer_kg_ha         REAL,
    emissions_per_kg         REAL,
    tillage_events_per_year  REAL,
    co2_capture_kg_ha_yr     REAL,
    pesticide_weighted_paf   REAL,   -- sum(avg_kg_ha[p] * avg_paf[p]) / sum(avg_kg_ha[p])
    pesticide_kg_per_kg_food REAL,   -- avg(pesticide_kg_ha) / avg(yield_kg_ha)

    -- animal averages (NULL for plant foods)
    neuron_count             REAL,
    weight_kg                REAL,
    yield_fraction           REAL,
    pasture_ha_per_kg_output REAL,
    native_fraction          REAL,
    bycatch_amount           REAL
);
