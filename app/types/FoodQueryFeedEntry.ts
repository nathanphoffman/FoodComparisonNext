import { Sourced } from './Sourced';

export interface IFoodQueryFeedEntry {
    plant: string;
    kg_feed_per_kg_output: Sourced<number>[];
}

export class FoodQueryFeedEntry implements IFoodQueryFeedEntry {
    plant!: string;
    kg_feed_per_kg_output!: Sourced<number>[];

    constructor(data: IFoodQueryFeedEntry) {
        Object.assign(this, data);
    }
}
