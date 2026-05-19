import { SourcedNumberArray } from './Sourced';

export interface IFoodQueryPesticide {
    name: string;
    paf: SourcedNumberArray;
    kg_ha: SourcedNumberArray | null;
}

export class FoodQueryPesticide implements IFoodQueryPesticide {
    name!: string;
    paf!: SourcedNumberArray;
    kg_ha!: SourcedNumberArray | null;

    constructor(data: IFoodQueryPesticide) {
        Object.assign(this, data);
    }
}
