import { ISourced } from '../../../lib/types';

export class SourcedNumberArray extends Array<ISourced<number>> {
  constructor(data: ISourced<number>[]) {
    super(...data);
  }

  weightedAverage(): number | null {

    if (this.length === 0) return null;
    const totalWeight = this.reduce((acc, curr) => acc + curr.confidence, 0);

    if (totalWeight === 0) return null;
    return this.reduce((acc, curr) => acc + curr.value * curr.confidence, 0) / totalWeight;
    
  }
}
