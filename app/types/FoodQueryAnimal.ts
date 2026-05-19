import { Sourced } from './Sourced';
import { FoodQueryFeedEntry } from './FoodQueryFeedEntry';

export interface IFoodQueryAnimal {
    neuron_count: Sourced<number>[] | null;
    weight_kg: Sourced<number>[] | null;
    yield_fraction: Sourced<number>[] | null;
    pasture_ha_per_kg_output: Sourced<number>[] | null;
    native_fraction: Sourced<number>[] | null;
    bycatch: { animal: string; amount: Sourced<number>[] } | null;
    feed: FoodQueryFeedEntry[] | null;
}

export class FoodQueryAnimal implements IFoodQueryAnimal {
    neuron_count!: Sourced<number>[] | null;
    weight_kg!: Sourced<number>[] | null;
    yield_fraction!: Sourced<number>[] | null;
    pasture_ha_per_kg_output!: Sourced<number>[] | null;
    native_fraction!: Sourced<number>[] | null;
    bycatch!: { animal: string; amount: Sourced<number>[] } | null;
    feed!: FoodQueryFeedEntry[] | null;

    constructor(data: IFoodQueryAnimal) {
        Object.assign(this, data);
    }
}
