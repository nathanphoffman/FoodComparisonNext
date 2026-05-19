import { SourcedArray } from './Sourced';
import { FoodQueryFeedEntry } from './FoodQueryFeedEntry';

export interface IFoodQueryAnimal {
    neuron_count: SourcedArray<number> | null;
    weight_kg: SourcedArray<number> | null;
    yield_fraction: SourcedArray<number> | null;
    pasture_ha_per_kg_output: SourcedArray<number> | null;
    native_fraction: SourcedArray<number> | null;
    bycatch: { animal: string; amount: SourcedArray<number> } | null;
    feed: FoodQueryFeedEntry[] | null;
}

export class FoodQueryAnimal implements IFoodQueryAnimal {
    neuron_count!: SourcedArray<number> | null;
    weight_kg!: SourcedArray<number> | null;
    yield_fraction!: SourcedArray<number> | null;
    pasture_ha_per_kg_output!: SourcedArray<number> | null;
    native_fraction!: SourcedArray<number> | null;
    bycatch!: { animal: string; amount: SourcedArray<number> } | null;
    feed!: FoodQueryFeedEntry[] | null;

    constructor(data: IFoodQueryAnimal) {
        Object.assign(this, data);
    }
}
