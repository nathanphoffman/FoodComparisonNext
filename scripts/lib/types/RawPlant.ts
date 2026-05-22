import { Plant } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';
import { PlantNormalizedFields } from './IFoodNormalized';
import { RawPesticide } from './RawPesticide';
import { RawPlantPesticide } from './RawPlantPesticide';

export interface PesticideAssociation {
  plantPesticide: RawPlantPesticide;
  pesticide: RawPesticide;
}

export class RawPlant {
  readonly id: number;
  readonly food_id: number;
  readonly yield_kg_ha: SourcedNumberArray;
  readonly water_per_kg: SourcedNumberArray;
  readonly green_water_per_kg: SourcedNumberArray;
  readonly blue_water_per_kg: SourcedNumberArray;
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
    this.green_water_per_kg = new SourcedNumberArray(data.green_water_per_kg ?? []);
    this.blue_water_per_kg = new SourcedNumberArray(data.blue_water_per_kg ?? []);
    this.soil_erosion = new SourcedNumberArray(data.soil_erosion ?? []);
    this.pesticide_kg_ha = new SourcedNumberArray(data.pesticide_kg_ha ?? []);
    this.fertilizer_kg_ha = new SourcedNumberArray(data.fertilizer_kg_ha ?? []);
    this.emissions_per_kg = new SourcedNumberArray(data.emissions_per_kg ?? []);
    this.tillage_events_per_year = new SourcedNumberArray(data.tillage_events_per_year ?? []);
    this.co2_capture_kg_ha_yr = new SourcedNumberArray(data.co2_capture_kg_ha_yr ?? []);
  }

  get avgPesticideWeightedFreshwaterPaf(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedSum = 0;
    for (const { plantPesticide, pesticide } of this.associations) {
      const avgKgHa = plantPesticide.kg_ha?.weightedAverage() ?? null;
      const avgPaf = pesticide.freshwaterPaf.weightedAverage();
      if (avgKgHa != null && avgPaf != null) {
        weightedSum += avgKgHa * avgPaf;
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedSum / totalKgHa : null;
  }

  get avgPesticideWeightedTerrestrialPaf(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedSum = 0;
    for (const { plantPesticide, pesticide } of this.associations) {
      const avgKgHa = plantPesticide.kg_ha?.weightedAverage() ?? null;
      const avgPaf = pesticide.terrestrialPaf.weightedAverage();
      if (avgKgHa != null && avgPaf != null) {
        weightedSum += avgKgHa * avgPaf;
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedSum / totalKgHa : null;
  }

  get avgPesticideWeightedInsectPaf(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedSum = 0;
    for (const { plantPesticide, pesticide } of this.associations) {
      const avgKgHa = plantPesticide.kg_ha?.weightedAverage() ?? null;
      const avgPaf = pesticide.insectPaf.weightedAverage();
      if (avgKgHa != null && avgPaf != null) {
        weightedSum += avgKgHa * avgPaf;
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedSum / totalKgHa : null;
  }

  get avgPesticideWeightedBeeHazard(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedSum = 0;
    for (const { plantPesticide, pesticide } of this.associations) {
      const avgKgHa = plantPesticide.kg_ha?.weightedAverage() ?? null;
      const avgLd50 = pesticide.beeLd50.weightedAverage();
      if (avgKgHa != null && avgLd50 != null && avgLd50 > 0) {
        weightedSum += avgKgHa * (1 / avgLd50);
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedSum / totalKgHa : null;
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
      green_water_per_kg: this.green_water_per_kg.weightedAverage(),
      blue_water_per_kg: this.blue_water_per_kg.weightedAverage(),
      soil_erosion: this.soil_erosion.weightedAverage(),
      pesticide_kg_ha: this.pesticide_kg_ha.weightedAverage(),
      fertilizer_kg_ha: this.fertilizer_kg_ha.weightedAverage(),
      emissions_per_kg: this.emissions_per_kg.weightedAverage(),
      tillage_events_per_year: this.tillage_events_per_year.weightedAverage(),
      co2_capture_kg_ha_yr: this.co2_capture_kg_ha_yr.weightedAverage(),
      pesticide_freshwater_paf: this.avgPesticideWeightedFreshwaterPaf,
      pesticide_terrestrial_paf: this.avgPesticideWeightedTerrestrialPaf,
      pesticide_insect_paf: this.avgPesticideWeightedInsectPaf,
      pesticide_bee_hazard: this.avgPesticideWeightedBeeHazard,
      pesticide_kg_per_kg_food: this.avgPesticideKgPerKgFood,
    };
  }
}
