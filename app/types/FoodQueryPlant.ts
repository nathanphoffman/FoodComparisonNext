import { Sourced } from './Sourced';
import { FoodQueryPesticide } from './FoodQueryPesticide';
import { FoodQueryAnimalKill } from './FoodQueryAnimalKill';

export interface IFoodQueryPlant {
    yield_kg_ha: Sourced<number>[] | null;
    water_per_kg: Sourced<number>[] | null;
    soil_erosion: Sourced<number>[] | null;
    pesticide_kg_ha: Sourced<number>[] | null;
    fertilizer_kg_ha: Sourced<number>[] | null;
    emissions_per_kg: Sourced<number>[] | null;
    tillage_events_per_year: Sourced<number>[] | null;
    co2_capture_kg_ha_yr: Sourced<number>[] | null;
    pesticides: FoodQueryPesticide[] | null;
    animal_kills: FoodQueryAnimalKill[] | null;
}

export class FoodQueryPlant implements IFoodQueryPlant {
    yield_kg_ha!: Sourced<number>[] | null;
    water_per_kg!: Sourced<number>[] | null;
    soil_erosion!: Sourced<number>[] | null;
    pesticide_kg_ha!: Sourced<number>[] | null;
    fertilizer_kg_ha!: Sourced<number>[] | null;
    emissions_per_kg!: Sourced<number>[] | null;
    tillage_events_per_year!: Sourced<number>[] | null;
    co2_capture_kg_ha_yr!: Sourced<number>[] | null;
    pesticides!: FoodQueryPesticide[] | null;
    animal_kills!: FoodQueryAnimalKill[] | null;

    constructor(data: IFoodQueryPlant) {
        Object.assign(this, data);
    }
}
