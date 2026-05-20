import { ISourced, NutritionValue } from '../../../lib/types';

export class SourcedNutritionalValueArray extends Array<ISourced<NutritionValue>> {
  constructor(data: ISourced<NutritionValue>[]) {
    super(...data);
  }

  weightedAverage(): NutritionValue | null {
    if (this.length === 0) return null;
    const totalWeight = this.reduce((acc, curr) => acc + curr.confidence, 0);
    if (totalWeight === 0) return null;
    const fields = ['calories', 'fat', 'sat_fat', 'protein', 'fiber'] as const;
    return fields.reduce((totals, field) => {
      totals[field] = this.reduce((sum, entry) => sum + entry.value[field] * entry.confidence, 0) / totalWeight;
      return totals;
    }, { calories: 0, fat: 0, sat_fat: 0, protein: 0, fiber: 0 });
  }
}
