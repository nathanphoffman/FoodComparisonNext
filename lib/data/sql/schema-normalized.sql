CREATE TABLE IF NOT EXISTS foods_normalized (
    food_id   INTEGER NOT NULL,
    is_feed   INTEGER NOT NULL DEFAULT 0,  -- 0 = food itself, 1 = feed crop aggregate

    slug       TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    type       TEXT    NOT NULL,            -- 'plant' | 'animal'
    tags       TEXT    NOT NULL,            -- json array of strings
    human_food INTEGER NOT NULL,            -- boolean

    -- nutrition averages (NULL for feed rows)
    calories                 REAL,
    fat                      REAL,
    sat_fat                  REAL,
    protein                  REAL,
    fiber                    REAL,

    -- plant metrics (NULL for animal foods; populated for plant foods AND feed rows)
    yield_kg_ha              REAL,
    water_per_kg             REAL,
    soil_erosion             REAL,
    pesticide_kg_ha          REAL,
    fertilizer_kg_ha         REAL,
    emissions_per_kg         REAL,
    tillage_events_per_year  REAL,
    co2_capture_kg_ha_yr     REAL,
    pesticide_weighted_paf   REAL,
    pesticide_kg_per_kg_food REAL,

    -- animal metrics (NULL for plant foods and feed rows)
    neuron_count             REAL,
    weight_kg                REAL,
    yield_fraction           REAL,
    pasture_ha_per_kg_output REAL,
    native_fraction          REAL,
    bycatch_amount           REAL,
    ch4_kg_per_kg_output     REAL,  -- enteric fermentation + manure; excludes land use + feed
    n2o_kg_per_kg_output     REAL,  -- manure management; excludes land use + feed crop fertilizer
    co2_kg_per_kg_output     REAL,  -- on-farm energy, processing, transport; excludes land use + feed

    PRIMARY KEY (food_id, is_feed)
);
