import { Sourced } from './Sourced';

export interface IFoodQueryAnimalKill {
    animal: string;
    kills_per_ha: Sourced<number>[] | null;
}

export class FoodQueryAnimalKill implements IFoodQueryAnimalKill {
    animal!: string;
    kills_per_ha!: Sourced<number>[] | null;

    constructor(data: IFoodQueryAnimalKill) {
        Object.assign(this, data);
    }
}
