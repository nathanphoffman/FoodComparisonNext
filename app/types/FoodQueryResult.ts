import { SourcedArray } from './Sourced';
import { FoodQueryPlant } from './FoodQueryPlant';
import { FoodQueryAnimal } from './FoodQueryAnimal';

interface NutritionValue {
    calories: number;
    fat: number;
    sat_fat: number;
    protein: number;
    fiber: number;
}

export interface IFoodQueryResult {
    id: number;
    slug: string;
    name: string;
    type: 'plant' | 'animal';
    tags: string[];
    nutrition: SourcedArray<NutritionValue>;
    plant: FoodQueryPlant | null;
    animal: FoodQueryAnimal | null;
}

export class FoodQueryResult implements IFoodQueryResult {
    id!: number;
    slug!: string;
    name!: string;
    type!: 'plant' | 'animal';
    tags!: string[];
    nutrition!: SourcedArray<NutritionValue>;
    plant!: FoodQueryPlant | null;
    animal!: FoodQueryAnimal | null;

    constructor(data: IFoodQueryResult) {
        Object.assign(this, data);
    }
}
