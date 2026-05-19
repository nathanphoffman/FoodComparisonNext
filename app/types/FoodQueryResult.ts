import { Sourced } from './Sourced';
import { FoodQueryPlant } from './FoodQueryPlant';
import { FoodQueryAnimal } from './FoodQueryAnimal';

export interface IFoodQueryResult {
    id: number;
    slug: string;
    name: string;
    type: 'plant' | 'animal';
    tags: string[];
    nutrition: Sourced<{ calories: number; fat: number; sat_fat: number; protein: number; fiber: number }>[];
    plant: FoodQueryPlant | null;
    animal: FoodQueryAnimal | null;
}

export class FoodQueryResult implements IFoodQueryResult {
    id!: number;
    slug!: string;
    name!: string;
    type!: 'plant' | 'animal';
    tags!: string[];
    nutrition!: Sourced<{ calories: number; fat: number; sat_fat: number; protein: number; fiber: number }>[];
    plant!: FoodQueryPlant | null;
    animal!: FoodQueryAnimal | null;

    constructor(data: IFoodQueryResult) {
        Object.assign(this, data);
    }
}
