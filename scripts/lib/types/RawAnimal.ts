import { Animal } from '../../../lib/types';
import { weightedAverage } from '../weighted-average';
import { AnimalNormalizedFields } from './IFoodNormalized';

export class RawAnimal {
  constructor(private data: Animal) {}

  normalizedFields(): AnimalNormalizedFields {
    return {
      neuron_count: weightedAverage(this.data.neuron_count),
      weight_kg: weightedAverage(this.data.weight_kg),
      yield_fraction: weightedAverage(this.data.yield_fraction),
      pasture_ha_per_kg_output: weightedAverage(this.data.pasture_ha_per_kg_output),
      native_fraction: weightedAverage(this.data.native_fraction),
      bycatch_amount: weightedAverage(this.data.bycatch_amount),
    };
  }
}
