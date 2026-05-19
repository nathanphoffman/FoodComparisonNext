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
        this.paf = new SourcedNumberArray(data.paf);
        this.kg_ha = data.kg_ha === null ? null : new SourcedNumberArray(data.kg_ha);
    }
}
