import { Pesticide } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';

export class RawPesticide {
  readonly id: number;
  readonly name: string;
  readonly freshwaterPaf: SourcedNumberArray;
  readonly terrestrialPaf: SourcedNumberArray;
  readonly insectPaf: SourcedNumberArray;
  readonly beeLd50: SourcedNumberArray;

  constructor(data: Pesticide) {
    this.id = data.id;
    this.name = data.name;
    this.freshwaterPaf = new SourcedNumberArray(data.freshwater_paf);
    this.terrestrialPaf = new SourcedNumberArray(data.terrestrial_paf ?? []);
    this.insectPaf = new SourcedNumberArray(data.insect_paf ?? []);
    this.beeLd50 = new SourcedNumberArray(data.bee_ld50 ?? []);
  }
}
