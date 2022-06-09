import { DataSet, RdfValue } from '@exec-graph/graph/types';
import { useMemo } from 'react';
import { useTable } from 'react-table';

export interface TableViewProps {
  data: DataSet;
}

/**
 * Displays the tabular data in a {@link DataSet} with a table
 *
 * @category React Component
 */
export function TableView(props: TableViewProps) {
  const columns = useMemo(
    () =>
      props.data?.tabular?.headers.map((header) => ({
        Header: header,
        accessor: (row: { [varkey: string]: RdfValue }) => row[header].value,
      })),
    [props.data?.tabular]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns ?? [], data: props.data.tabular?.data ?? [] });

  return (
    <div className="bg-white overflow-x-auto">
      <table {...getTableProps()} className="table-auto w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-4 font-bold text-left"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b hover:bg-gray-50">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="p-4">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
