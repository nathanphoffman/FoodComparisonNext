import { ISourced, NutritionValue } from '../../../lib/types';

export class SourcedNutritionalValueArray extends Array<ISourced<NutritionValue>> {
  constructor(data: ISourced<NutritionValue>[]) {
    super(...data);
  }

  weightedAverage(): NutritionValue | null {
    if (this.length === 0) return null;
    const totalWeight = this.reduce((acc, curr) => acc + curr.confidence, 0);
    if (totalWeight === 0) return null;

    const reqFields = ['calories', 'fat', 'sat_fat', 'protein', 'fiber'] as const;
    const required = reqFields.reduce((acc, field) => {
      acc[field] = this.reduce((sum, e) => sum + e.value[field] * e.confidence, 0) / totalWeight;
      return acc;
    }, {} as Record<typeof reqFields[number], number>);

    const optAvg = (field: 'sodium' | 'carbs' | 'sugar' | 'cholesterol' | 'trans_fat' | 'glycemic_index'): number | null => {
      const entries = Array.from(this).filter(e => e.value[field] != null);
      if (entries.length === 0) return null;
      const w = entries.reduce((acc, e) => acc + e.confidence, 0);
      return entries.reduce((sum, e) => sum + (e.value[field] as number) * e.confidence, 0) / w;
    };

    return {
      ...required,
      sodium:         optAvg('sodium'),
      carbs:          optAvg('carbs'),
      sugar:          optAvg('sugar'),
      cholesterol:    optAvg('cholesterol'),
      trans_fat:      optAvg('trans_fat'),
      glycemic_index: optAvg('glycemic_index'),
    };
  }
}
