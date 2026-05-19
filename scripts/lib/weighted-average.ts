import { ISourced } from '../../lib/types';

export function weightedAverage(sourcedArray: ISourced<number>[] | null | undefined): number | null {
  if (!sourcedArray || sourcedArray.length === 0) return null;
  const totalWeight = sourcedArray.reduce((s, e) => s + e.confidence, 0);
  if (totalWeight === 0) return null;
  return sourcedArray.reduce((s, e) => s + e.value * e.confidence, 0) / totalWeight;
}

interface NutritionAverage {
  calories: number;
  fat: number;
  sat_fat: number;
  protein: number;
  fiber: number;
}

export function weightedAverageNutrition(
  sourcedArray: ISourced<NutritionAverage>[] | null | undefined
): NutritionAverage | null {
  if (!sourcedArray || sourcedArray.length === 0) return null;
  const totalWeight = sourcedArray.reduce((s, e) => s + e.confidence, 0);
  if (totalWeight === 0) return null;
  const fields = ['calories', 'fat', 'sat_fat', 'protein', 'fiber'] as const;
  return fields.reduce((acc, field) => {
    acc[field] = sourcedArray.reduce((s, e) => s + e.value[field] * e.confidence, 0) / totalWeight;
    return acc;
  }, {} as NutritionAverage);
}
