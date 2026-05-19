import { ISourced } from "@/lib/types";
import { Sourced } from "./Sourced";

export interface INutritionValue {
    calories: number;
    fat: number;
    sat_fat: number;
    protein: number;
    fiber: number;
}

export class NutritionValue implements INutritionValue {
    calories!: number;
    fat!: number;
    sat_fat!: number;
    protein!: number;
    fiber!: number;

    constructor(data: INutritionValue) {
        Object.assign(this, data);
    }
}

export class SourcedNutritionalValue implements Sourced<NutritionValue> {
    value!: NutritionValue;
    source_id!: number;
    confidence!: number;

    constructor(data: ISourced<NutritionValue>) {
        Object.assign(this, data);
        this.value = new NutritionValue(data.value);
    }
}

export class SourcedNutritionalValueArray extends Array<SourcedNutritionalValue> {

    constructor(data: Array<SourcedNutritionalValue>) {
        super(...data);
    }

    weightedAverage(): NutritionValue {
        const weightedTotal = this.reduce((prev, curr) => {
            return {
                calories: prev.calories + curr.value.calories * curr.confidence,
                fat: prev.fat + curr.value.fat * curr.confidence,
                sat_fat: prev.sat_fat + curr.value.sat_fat * curr.confidence,
                protein: prev.protein + curr.value.protein * curr.confidence,
                fiber: prev.fiber + curr.value.fiber * curr.confidence
            };

        }, { calories: 0, fat: 0, sat_fat: 0, protein: 0, fiber: 0 });

        const confidenceTotal = this.reduce((prev, curr) => prev + curr.confidence, 0);

        return {
            calories: weightedTotal.calories / confidenceTotal,
            fat: weightedTotal.fat / confidenceTotal,
            sat_fat: weightedTotal.sat_fat / confidenceTotal,
            protein: weightedTotal.protein / confidenceTotal,
            fiber: weightedTotal.fiber / confidenceTotal,
        };

    }
}
