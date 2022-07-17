import { Disclosure } from '@headlessui/react';
import { DateTime } from 'luxon';
import { SparqlInput } from '@exec-graph/ui-react/sparql-input';
import { Query, ExecutedQuery } from '@exec-graph/explorer/types';

/**
 * Type definition of mandatory and optional properties of the {@link QueryHistory} component
 */
export interface QueryHistoryProps {
  history: ExecutedQuery[];
  localStorageEnabled: boolean;
  /**
   * invoked when user selects a predefined query
   */
  onSelect: (query: Query) => void;
  /**
   * invoked when user enables/disables local storage integration
   */
  toggleLocalStorage: (enabled: boolean) => void;
}

/**
 * Displays the history of executed queries and allows a
 * user to select a previous one and execute it again.
 *
 * @category React Component
 * @author Julius Stoerrle
 */
export function QueryHistory(props: QueryHistoryProps): JSX.Element {
  return (
    <>
      <div className="p-4 flex border-b border-gray-300">
        <div className="text-sm text-gray-600 max-w-prose">
          Click to re-execute one of your recent queries:
        </div>
        <div className="flex items-start ml-auto">
          <div className="flex items-center h-5">
            <input
              name="queryHistoryStore"
              checked={props.localStorageEnabled}
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              onChange={(event) =>
                props.toggleLocalStorage(event.target.checked)
              }
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="queryHistoryStore"
              className="font-medium text-gray-700"
            >
              Store query history locally on your device
            </label>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto py-2 w-max max-w-full md:min-w-[60%]">
        {props.history.map((entry) => (
          <div className="p-4 py-2" key={entry.executedAt}>
            <button
              onClick={() => props.onSelect(entry)}
              className="block text-left w-full border border-gray-300 p-4 rounded-md bg-white hover:border-fau-blue"
            >
              <Disclosure>
                {({ open }) => (
                  <>
                    <div className="flex">
                      <span className="font-bold mr-4">
                        {entry.title} -
                        {DateTime.fromISO(entry.executedAt).toLocaleString(
                          DateTime.DATETIME_FULL_WITH_SECONDS,
                          { locale: 'en-gb' }
                        )}
                      </span>
                      <span
                        className="ml-auto shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Disclosure.Button className="border border-gray-300 rounded p-1 px-2 text-gray-600 text-sm">
                          <>{open ? 'Hide' : 'Show'} SPARQL</>
                        </Disclosure.Button>
                      </span>
                      <span className="shrink-0 border border-gray-300 p-1 px-2 bg-fau-blue text-white text-sm rounded ml-2">
                        Select
                      </span>
                    </div>
                    <Disclosure.Panel className="text-gray-500">
                      <SparqlInput
                        className="text-xs !bg-white"
                        value={entry.sparql}
                        readonly={true}
                      ></SparqlInput>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default QueryHistory;
