import { SourcedNumberArray } from './Sourced';
import { FoodQueryPesticide } from './FoodQueryPesticide';
import { FoodQueryAnimalKill } from './FoodQueryAnimalKill';

export interface IFoodQueryPlant {
    yield_kg_ha: SourcedNumberArray | null;
    water_per_kg: SourcedNumberArray | null;
    soil_erosion: SourcedNumberArray | null;
    pesticide_kg_ha: SourcedNumberArray | null;
    fertilizer_kg_ha: SourcedNumberArray | null;
    emissions_per_kg: SourcedNumberArray | null;
    tillage_events_per_year: SourcedNumberArray | null;
    co2_capture_kg_ha_yr: SourcedNumberArray | null;
    pesticides: FoodQueryPesticide[] | null;
    animal_kills: FoodQueryAnimalKill[] | null;
}

export class FoodQueryPlant implements IFoodQueryPlant {
    yield_kg_ha!: SourcedNumberArray | null;
    water_per_kg!: SourcedNumberArray | null;
    soil_erosion!: SourcedNumberArray | null;
    pesticide_kg_ha!: SourcedNumberArray | null;
    fertilizer_kg_ha!: SourcedNumberArray | null;
    emissions_per_kg!: SourcedNumberArray | null;
    tillage_events_per_year!: SourcedNumberArray | null;
    co2_capture_kg_ha_yr!: SourcedNumberArray | null;
    pesticides!: FoodQueryPesticide[] | null;
    animal_kills!: FoodQueryAnimalKill[] | null;

    constructor(data: IFoodQueryPlant) {
        Object.assign(this, data);
    }
}
