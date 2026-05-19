import { Sourced } from './Sourced';

export interface IFoodQueryPesticide {
    name: string;
    paf: Sourced<number>[];
    kg_ha: Sourced<number>[] | null;
}

export class FoodQueryPesticide implements IFoodQueryPesticide {
    name!: string;
    paf!: Sourced<number>[];
    kg_ha!: Sourced<number>[] | null;

    constructor(data: IFoodQueryPesticide) {
        Object.assign(this, data);
    }
}
