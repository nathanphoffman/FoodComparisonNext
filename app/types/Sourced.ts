import { ISourced } from '@/lib/types';

export class Sourced<T> implements ISourced<T> {
    value!: T;
    source_id!: number;
    confidence!: number;

    constructor(data: ISourced<T>) {
        Object.assign(this, data);
    }
}
