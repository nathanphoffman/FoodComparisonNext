import { AnimalFeed } from '../../../lib/types';
import { SourcedNumberArray } from './SourcedNumberArray';

export class RawAnimalFeed {
  readonly animal_id: number;
  readonly plant_id: number;
  readonly kg_feed_per_kg_output: SourcedNumberArray;

  constructor(data: AnimalFeed) {
    this.animal_id = data.animal_id;
    this.plant_id = data.plant_id;
    this.kg_feed_per_kg_output = new SourcedNumberArray(data.kg_feed_per_kg_output);
  }
}
