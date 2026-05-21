export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number };

export type NutritionDetail = {
  protein:       number;
  fiber:         number;
  saturatedFat:  number;
  calories:      number;
  sodium:        number | null;
  carbs:         number | null;
  sugar:         number | null;
  cholesterol:   number | null;
  transFat:      number | null;
};

export type LandUseDetail = {
  type:                       'plant' | 'animal';
  yieldKilogramsPerHectare:   number | null;
  pastureHectaresPerKilogram: number | null;
};

export type IntelligenceDetail = {
  neuronCount:   number;
  weightKg:      number | null;
  yieldFraction: number | null;
};
