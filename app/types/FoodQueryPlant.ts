import { SourcedArray } from './Sourced';
import { FoodQueryPesticide } from './FoodQueryPesticide';
import { FoodQueryAnimalKill } from './FoodQueryAnimalKill';

export interface IFoodQueryPlant {
    yield_kg_ha: SourcedArray<number> | null;
    water_per_kg: SourcedArray<number> | null;
    soil_erosion: SourcedArray<number> | null;
    pesticide_kg_ha: SourcedArray<number> | null;
    fertilizer_kg_ha: SourcedArray<number> | null;
    emissions_per_kg: SourcedArray<number> | null;
    tillage_events_per_year: SourcedArray<number> | null;
    co2_capture_kg_ha_yr: SourcedArray<number> | null;
    pesticides: FoodQueryPesticide[] | null;
    animal_kills: FoodQueryAnimalKill[] | null;
}

export class FoodQueryPlant implements IFoodQueryPlant {
    yield_kg_ha!: SourcedArray<number> | null;
    water_per_kg!: SourcedArray<number> | null;
    soil_erosion!: SourcedArray<number> | null;
    pesticide_kg_ha!: SourcedArray<number> | null;
    fertilizer_kg_ha!: SourcedArray<number> | null;
    emissions_per_kg!: SourcedArray<number> | null;
    tillage_events_per_year!: SourcedArray<number> | null;
    co2_capture_kg_ha_yr!: SourcedArray<number> | null;
    pesticides!: FoodQueryPesticide[] | null;
    animal_kills!: FoodQueryAnimalKill[] | null;

    constructor(data: IFoodQueryPlant) {
        Object.assign(this, data);
    }
}
