
'use client'

import { useEffect } from 'react'
import { Row } from './Row';

export function Table() {


    const sampleData = [{ calories: 1, yo: 5 }, { calories: 2, yo: 6 }];

    type SampleDataType = typeof sampleData[number];
    type KeyOfSampleData = (keyof typeof sampleData[number])[];

    const columnOrder: KeyOfSampleData = ["calories"];

    const rows = sampleData.map(row => (<Row<SampleDataType, KeyOfSampleData>
        data={row} columnOrder={columnOrder}></Row>));

    return <table>{rows}</table>

}