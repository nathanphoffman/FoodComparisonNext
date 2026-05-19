import { SourcedArray } from './Sourced';
import { FoodQueryPlant } from './FoodQueryPlant';
import { FoodQueryAnimal } from './FoodQueryAnimal';
import { NutritionValue } from './NutritionValue';

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
        this.nutrition = new SourcedArray<NutritionValue>(data.nutrition);
        this.plant = data.plant === null  ? null : new FoodQueryPlant(data.plant);
        this.animal = data.animal === null  ? null : new FoodQueryAnimal(data.animal);
    }
}
