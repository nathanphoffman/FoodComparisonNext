import { Sourced, SourcedArray } from './Sourced';

export interface IFoodQueryPesticide {
    name: string;
    paf: SourcedArray<number>;
    kg_ha: SourcedArray<number> | null;
}

export class FoodQueryPesticide implements IFoodQueryPesticide {
    name!: string;
    paf!: SourcedArray<number>;
    kg_ha!: SourcedArray<number> | null;

    constructor(data: IFoodQueryPesticide) {
        Object.assign(this, data);
    }
}
