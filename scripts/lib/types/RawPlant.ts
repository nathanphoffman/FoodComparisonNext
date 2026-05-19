import { Plant } from '../../../lib/types';
import { weightedAverage } from '../weighted-average';
import { PlantNormalizedFields } from './IFoodNormalized';
import { RawPesticide } from './RawPesticide';
import { RawPlantPesticide } from './RawPlantPesticide';

export interface PesticideAssociation {
  pp: RawPlantPesticide;
  pesticide: RawPesticide;
}

export class RawPlant {
  constructor(
    private data: Plant,
    private associations: PesticideAssociation[],
  ) {}

  get id(): number { return this.data.id; }

  normalizedFields(): PlantNormalizedFields {
    return {
      yield_kg_ha: weightedAverage(this.data.yield_kg_ha),
      water_per_kg: weightedAverage(this.data.water_per_kg),
      soil_erosion: weightedAverage(this.data.soil_erosion),
      pesticide_kg_ha: weightedAverage(this.data.pesticide_kg_ha),
      fertilizer_kg_ha: weightedAverage(this.data.fertilizer_kg_ha),
      emissions_per_kg: weightedAverage(this.data.emissions_per_kg),
      tillage_events_per_year: weightedAverage(this.data.tillage_events_per_year),
      co2_capture_kg_ha_yr: weightedAverage(this.data.co2_capture_kg_ha_yr),
      pesticide_weighted_paf: this.pesticideWeightedPaf(),
      pesticide_kg_per_kg_food: this.pesticideKgPerKgFood(),
    };
  }

  private pesticideWeightedPaf(): number | null {
    if (this.associations.length === 0) return null;
    let totalKgHa = 0;
    let weightedPafSum = 0;
    for (const { pp, pesticide } of this.associations) {
      const avgKgHa = weightedAverage(pp.data.kg_ha);
      const avgPaf = weightedAverage(pesticide.data.paf);
      if (avgKgHa != null && avgPaf != null) {
        weightedPafSum += avgKgHa * avgPaf;
        totalKgHa += avgKgHa;
      }
    }
    return totalKgHa > 0 ? weightedPafSum / totalKgHa : null;
  }

  private pesticideKgPerKgFood(): number | null {
    const avgPesticideKgHa = weightedAverage(this.data.pesticide_kg_ha);
    const avgYield = weightedAverage(this.data.yield_kg_ha);
    if (avgPesticideKgHa == null || avgYield == null || avgYield === 0) return null;
    return avgPesticideKgHa / avgYield;
  }
}
