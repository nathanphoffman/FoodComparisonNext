import { Cell } from './Cell';

export type RowProps<DataType, DataTypeProps> = { data: DataType, columnOrder: DataTypeProps, children?: React.ReactElement[] };

export function Row<DataType, DataTypeProps extends (keyof DataType)[]>(
    { data, columnOrder, children }:
        RowProps<DataType, DataTypeProps>) {

    if (children) return (<tr>{children}</tr>);

    const jsxCells = columnOrder.map((column) => {

        if (!data[column]) throw new Error("There is a mismatch of row data to column/key entry.", { cause: { data, column } });
        else return <Cell>{String(data[column])}</Cell>
    });

    return (<tr>{jsxCells}</tr>)

}