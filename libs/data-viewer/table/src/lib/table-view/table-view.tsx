/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSet, RdfValue } from '@exec-graph/graph/types';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useMemo } from 'react';
import {
  usePagination,
  useTable,
  UsePaginationInstanceProps,
  TableInstance,
} from 'react-table';

/**
 * Type definition of mandatory and optional properties of the {@link TableView} component
 */
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore The typing of react-table is a bit difficult with paginiation
    state: { pageIndex, pageSize },
  } = useTable(
    { columns: columns ?? [], data: props.data.tabular?.data ?? [] },
    usePagination
  ) as TableInstance<{ [varkey: string]: RdfValue }> &
    UsePaginationInstanceProps<{ [varkey: string]: RdfValue }>;

  const pages = createPageListForPaginator(pageCount, pageIndex);
  return (
    <div className="bg-white overflow-x-auto">
      <table {...getTableProps()} className="table-auto w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-4 font-bold text-left border-b-2 border-gray-200"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b hover:bg-gray-50">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="p-2 text-sm">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            disabled={!canNextPage}
            onClick={() => nextPage()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center justify-end">
          <div className="hidden lg:block mr-auto">
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {pageIndex * pageSize + pageSize}
              </span>{' '}
              of{' '}
              <span className="font-medium">
                {props.data.tabular?.data.length}
              </span>{' '}
              results
            </p>
          </div>
          <div className="hidden md:block">
            <label>
              <span className="text-sm font-medium text-gray-700">
                Page Size
              </span>
              <select
                name="propertySelect_0"
                value={pageSize}
                onChange={(e) => setPageSize(+e.target.value)}
                className="shadow-sm ml-2 bg-white sm:text-sm border border-gray-300 rounded-md p-2"
              >
                {[10, 25, 50, 100].map((entries) => (
                  <option key={entries} value={entries}>
                    {entries}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="ml-4">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                disabled={!canPreviousPage}
                onClick={() => previousPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <HiOutlineChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {pages.map((pNr) => (
                <button
                  key={pNr}
                  onClick={() => gotoPage(pNr - 1)}
                  aria-current={pNr === pageIndex + 1 ? 'page' : 'false'}
                  className={
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium' +
                    (pNr === pageIndex + 1
                      ? ' z-10 bg-fau-blue border-fau-blue text-white'
                      : ' bg-white border-gray-300 text-gray-500 hover:bg-gray-50')
                  }
                >
                  {pNr}
                </button>
              ))}
              <button
                disabled={!canNextPage}
                onClick={() => nextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <HiOutlineChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableView;

/**
 * Returns a list of page numbers to show in the paginator
 * based on the total number of pages and the currently selected one.
 *
 * The function ensures we don't show page numbers that do not exist.
 */
function createPageListForPaginator(
  pageCount: number,
  pageIndex: number
): number[] {
  return pageCount < 11
    ? Array.from({ length: pageCount }, (_, i) => i + 1) // We have less than 10 pages, only show what we have
    : pageIndex < 5
    ? Array.from({ length: 10 }, (_, i) => i + 1) // we are in the beginning, show the first 10 pages
    : pageIndex + 5 > pageCount
    ? Array.from({ length: 10 }, (_, i) => pageCount - 9 + i) // reached the end of the list, show the last 10
    : Array.from({ length: 10 }, (_, i) => i + 1 + pageIndex - 5); // somehwere in the middle, show +/- 5 pages
}
