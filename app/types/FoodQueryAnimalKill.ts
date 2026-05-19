import { SourcedArray } from './Sourced';

export interface IFoodQueryAnimalKill {
    animal: string;
    kills_per_ha: SourcedArray<number> | null;
}

export class FoodQueryAnimalKill implements IFoodQueryAnimalKill {
    animal!: string;
    kills_per_ha!: SourcedArray<number> | null;

    constructor(data: IFoodQueryAnimalKill) {
        Object.assign(this, data);
    }
}
