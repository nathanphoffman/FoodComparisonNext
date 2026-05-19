import { ISourced } from '@/lib/types';

export class Sourced<T> implements ISourced<T> {
    value!: T;
    source_id!: number;
    confidence!: number;

    constructor(data: ISourced<T>) {
        Object.assign(this, data);
    }
}

export class SourcedNumber implements ISourced<number> {
    value!: number;
    source_id!: number;
    confidence!: number;

    constructor(data: ISourced<T>) {
        Object.assign(this, data);
    }
}

export class SourcedNumberArray extends Array<SourcedNumber> {
    weightedAverage(): number {
        const weightedTotal = this.reduce((prev, curr) => prev + curr.value * curr.confidence, 0);
        const confidenceTotal = this.reduce((prev, curr) => prev + curr.confidence, 0);

        return weightedTotal / confidenceTotal;
    }
}

export class SourcedArray<T> extends Array<Sourced<T>> {

    // placeholder

    /*
        weightedAverage(): number {
            this.reduce((prev, curr) => prev + curr.value * curr.confidence, 0)
        }
            */
}
