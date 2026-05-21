export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number };

export type NutritionDetail = {
  calories:      number;
  fat:           number;
  saturatedFat:  number;
  transFat:      number | null;
  cholesterol:   number | null;
  sodium:        number | null;
  carbs:         number | null;
  fiber:         number;
  sugar:         number | null;
  protein:       number;
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
