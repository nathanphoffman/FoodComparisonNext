import { PlantPesticide } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';

export class RawPlantPesticide {
  readonly plant_id: number;
  readonly pesticide_id: number;
  readonly kg_ha: SourcedNumberArray | null;

  constructor(data: PlantPesticide) {
    this.plant_id = data.plant_id;
    this.pesticide_id = data.pesticide_id;
    this.kg_ha = data.kg_ha ? new SourcedNumberArray(data.kg_ha) : null;
  }
}
