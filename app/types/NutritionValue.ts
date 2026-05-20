import { ISourced } from '@/lib/types';
import { Sourced } from './Sourced';

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
        const weightedTotal = this.reduce((totals, entry) => {
            return {
                calories: totals.calories + entry.value.calories * entry.confidence,
                fat: totals.fat + entry.value.fat * entry.confidence,
                sat_fat: totals.sat_fat + entry.value.sat_fat * entry.confidence,
                protein: totals.protein + entry.value.protein * entry.confidence,
                fiber: totals.fiber + entry.value.fiber * entry.confidence
            };

        }, { calories: 0, fat: 0, sat_fat: 0, protein: 0, fiber: 0 });

        const confidenceTotal = this.reduce((sum, entry) => sum + entry.confidence, 0);

        return {
            calories: weightedTotal.calories / confidenceTotal,
            fat: weightedTotal.fat / confidenceTotal,
            sat_fat: weightedTotal.sat_fat / confidenceTotal,
            protein: weightedTotal.protein / confidenceTotal,
            fiber: weightedTotal.fiber / confidenceTotal,
        };

    }
}
