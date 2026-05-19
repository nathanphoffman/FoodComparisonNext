import { Pesticide } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';

export class RawPesticide {
  readonly id: number;
  readonly name: string;
  readonly paf: SourcedNumberArray;

  constructor(data: Pesticide) {
    this.id = data.id;
    this.name = data.name;
    this.paf = new SourcedNumberArray(data.paf);
  }
}
