import { Animal } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';
import { AnimalNormalizedFields, PlantNormalizedFields } from './IFoodNormalized';
import { RawAnimalFeed } from './RawAnimalFeed';
import { RawPlant } from './RawPlant';

export interface FeedEntry {
  feed: RawAnimalFeed;
  plant: RawPlant;
}

export class RawAnimal {
  readonly neuron_count: SourcedNumberArray;
  readonly weight_kg: SourcedNumberArray;
  readonly yield_fraction: SourcedNumberArray;
  readonly pasture_ha_per_kg_output: SourcedNumberArray;
  readonly native_fraction: SourcedNumberArray;
  readonly bycatch_amount: SourcedNumberArray;

  constructor(data: Animal, private feedEntries: FeedEntry[]) {
    this.neuron_count = new SourcedNumberArray(data.neuron_count ?? []);
    this.weight_kg = new SourcedNumberArray(data.weight_kg ?? []);
    this.yield_fraction = new SourcedNumberArray(data.yield_fraction ?? []);
    this.pasture_ha_per_kg_output = new SourcedNumberArray(data.pasture_ha_per_kg_output ?? []);
    this.native_fraction = new SourcedNumberArray(data.native_fraction ?? []);
    this.bycatch_amount = new SourcedNumberArray(data.bycatch_amount ?? []);
  }

  normalizedFields(): AnimalNormalizedFields {
    return {
      neuron_count: this.neuron_count.weightedAverage(),
      weight_kg: this.weight_kg.weightedAverage(),
      yield_fraction: this.yield_fraction.weightedAverage(),
      pasture_ha_per_kg_output: this.pasture_ha_per_kg_output.weightedAverage(),
      native_fraction: this.native_fraction.weightedAverage(),
      bycatch_amount: this.bycatch_amount.weightedAverage(),
    };
  }

  feedNormalizedFields(): PlantNormalizedFields | null {
    if (this.feedEntries.length === 0) return null;

    let emissions = 0, water = 0, soilErosion = 0;
    let fertilizerKgHa = 0, tillage = 0, co2Capture = 0, pesticideKgPerKg = 0;
    let pafNumerator = 0, pafDenominator = 0;

    for (const { feed, plant } of this.feedEntries) {
      const r = feed.kg_feed_per_kg_output.weightedAverage();
      if (r == null) continue;

      const avgYield = plant.yield_kg_ha.weightedAverage();
      const avgEmissions = plant.emissions_per_kg.weightedAverage();
      const avgWater = plant.water_per_kg.weightedAverage();
      const avgSoilErosion = plant.soil_erosion.weightedAverage();
      const avgFertilizer = plant.fertilizer_kg_ha.weightedAverage();
      const avgTillage = plant.tillage_events_per_year.weightedAverage();
      const avgCo2 = plant.co2_capture_kg_ha_yr.weightedAverage();
      const avgPesticideKgPerKg = plant.avgPesticideKgPerKgFood;
      const avgPaf = plant.avgPesticideWeightedPaf;

      if (avgEmissions != null) emissions += r * avgEmissions;
      if (avgWater != null) water += r * avgWater;

      if (avgYield != null && avgYield > 0) {
        if (avgSoilErosion != null) soilErosion += r * avgSoilErosion / avgYield;
        if (avgFertilizer != null) fertilizerKgHa += r * avgFertilizer / avgYield;
        if (avgTillage != null) tillage += r * avgTillage / avgYield;
        if (avgCo2 != null) co2Capture += r * avgCo2 / avgYield;
      }

      if (avgPesticideKgPerKg != null) {
        pesticideKgPerKg += r * avgPesticideKgPerKg;
        if (avgPaf != null) {
          pafNumerator += r * avgPesticideKgPerKg * avgPaf;
          pafDenominator += r * avgPesticideKgPerKg;
        }
      }
    }

    return {
      yield_kg_ha: null,
      water_per_kg: water || null,
      soil_erosion: soilErosion || null,
      pesticide_kg_ha: null,
      fertilizer_kg_ha: fertilizerKgHa || null,
      emissions_per_kg: emissions || null,
      tillage_events_per_year: tillage || null,
      co2_capture_kg_ha_yr: co2Capture || null,
      pesticide_weighted_paf: pafDenominator > 0 ? pafNumerator / pafDenominator : null,
      pesticide_kg_per_kg_food: pesticideKgPerKg || null,
    };
  }
}
