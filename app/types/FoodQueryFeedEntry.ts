import { SourcedArray } from './Sourced';

export interface IFoodQueryFeedEntry {
    plant: string;
    kg_feed_per_kg_output: SourcedArray<number>;
}

export class FoodQueryFeedEntry implements IFoodQueryFeedEntry {
    plant!: string;
    kg_feed_per_kg_output!: SourcedArray<number>;

    constructor(data: IFoodQueryFeedEntry) {
        Object.assign(this, data);
    }
}
