import { ISourced } from '../../../lib/types';

export class SourcedNumberArray extends Array<ISourced<number>> {
  constructor(data: ISourced<number>[]) {
    super(...data);
  }

  weightedAverage(): number | null {
    if (this.length === 0) return null;
    const totalWeight = this.reduce((sum, entry) => sum + entry.confidence, 0);
    if (totalWeight === 0) return null;
    return this.reduce((sum, entry) => sum + entry.value * entry.confidence, 0) / totalWeight;
  }
}
