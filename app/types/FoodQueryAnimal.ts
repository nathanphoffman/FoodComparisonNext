import { SourcedNumberArray } from './Sourced';
import { FoodQueryFeedEntry } from './FoodQueryFeedEntry';

export interface IFoodQueryAnimal {
    neuron_count: SourcedNumberArray | null;
    weight_kg: SourcedNumberArray | null;
    yield_fraction: SourcedNumberArray | null;
    pasture_ha_per_kg_output: SourcedNumberArray | null;
    native_fraction: SourcedNumberArray | null;
    bycatch: { animal: string; amount: SourcedNumberArray } | null;
    feed: FoodQueryFeedEntry[] | null;
}

export class FoodQueryAnimal implements IFoodQueryAnimal {
    neuron_count!: SourcedNumberArray | null;
    weight_kg!: SourcedNumberArray | null;
    yield_fraction!: SourcedNumberArray | null;
    pasture_ha_per_kg_output!: SourcedNumberArray | null;
    native_fraction!: SourcedNumberArray | null;
    bycatch!: { animal: string; amount: SourcedNumberArray } | null;
    feed!: FoodQueryFeedEntry[] | null;

    constructor(data: IFoodQueryAnimal) {
        Object.assign(this, data);
    }
}
