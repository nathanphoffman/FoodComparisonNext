import { Plant } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';
import { PlantNormalizedFields } from './IFoodNormalized';
import { RawPesticide } from './RawPesticide';
import { RawPlantPesticide } from './RawPlantPesticide';

export interface PesticideAssociation {
  pp: RawPlantPesticide;
  pesticide: RawPesticide;
}

export class RawPlant {
  readonly id: number;
  readonly food_id: number;
  readonly yield_kg_ha: SourcedNumberArray;
  readonly water_per_kg: SourcedNumberArray;
  readonly soil_erosion: SourcedNumberArray;
  readonly pesticide_kg_ha: SourcedNumberArray;
  readonly fertilizer_kg_ha: SourcedNumberArray;
  readonly emissions_per_kg: SourcedNumberArray;
  readonly tillage_events_per_year: SourcedNumberArray;
  readonly co2_capture_kg_ha_yr: SourcedNumberArray;

  constructor(data: Plant, private associations: PesticideAssociation[]) {
    this.id = data.id;
    this.food_id = data.food_id;
    this.yield_kg_ha = new SourcedNumberArray(data.yield_kg_ha ?? []);
    this.water_per_kg = new SourcedNumberArray(data.water_per_kg ?? []);
    this.soil_erosion = new SourcedNumberArray(data.soil_erosion ?? []);
    this.pesticide_kg_ha = new SourcedNumberArray(data.pesticide_kg_ha ?? []);
    this.fertilizer_kg_ha = new SourcedNumberArray(data.fertilizer_kg_ha ?? []);
    this.emissions_per_kg = new SourcedNumberArray(data.emissions_per_kg ?? []);
    this.tillage_events_per_year = new SourcedNumberArray(data.tillage_events_per_year ?? []);
    this.co2_capture_kg_ha_yr = new SourcedNumberArray(data.co2_capture_kg_ha_yr ?? []);
  }

  get avgPesticideWeightedPaf(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedPafSum = 0;
    for (const { pp, pesticide } of this.associations) {
      const avgKgHa = pp.kg_ha?.weightedAverage() ?? null;
      const avgPaf = pesticide.paf.weightedAverage();
      if (avgKgHa != null && avgPaf != null) {
        weightedPafSum += avgKgHa * avgPaf;
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedPafSum / totalKgHa : null;
  }

  get avgPesticideKgPerKgFood(): number | null {
    const avgPesticideKgHa = this.pesticide_kg_ha.weightedAverage();
    const avgYield = this.yield_kg_ha.weightedAverage();
    if (avgPesticideKgHa == null || avgYield == null || avgYield === 0) return null;
    return avgPesticideKgHa / avgYield;
  }

  normalizedFields(): PlantNormalizedFields {
    return {
      yield_kg_ha: this.yield_kg_ha.weightedAverage(),
      water_per_kg: this.water_per_kg.weightedAverage(),
      soil_erosion: this.soil_erosion.weightedAverage(),
      pesticide_kg_ha: this.pesticide_kg_ha.weightedAverage(),
      fertilizer_kg_ha: this.fertilizer_kg_ha.weightedAverage(),
      emissions_per_kg: this.emissions_per_kg.weightedAverage(),
      tillage_events_per_year: this.tillage_events_per_year.weightedAverage(),
      co2_capture_kg_ha_yr: this.co2_capture_kg_ha_yr.weightedAverage(),
      pesticide_weighted_paf: this.avgPesticideWeightedPaf,
      pesticide_kg_per_kg_food: this.avgPesticideKgPerKgFood,
    };
  }
}
