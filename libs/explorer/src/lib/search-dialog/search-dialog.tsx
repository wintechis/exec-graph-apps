import { DataSource } from '@exec-graph/graph/types';
import { Dialog } from '@headlessui/react';
import { ChevronRightIcon, CloudDownloadIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import ExploreDialog from '../dialog/dialog';

const searchQuery = (query: string) => `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>
SELECT ?subject (SAMPLE(?l) as ?label)
WHERE
{ 
    ?subject ?p ?queryMatched;
       rdf:type ?c;
       <http://www.w3.org/2000/01/rdf-schema#label> ?l.
    FILTER regex(?queryMatched, "${query}", "i")
    FILTER (?c IN ( schema:City, schema:Person, schema:Organization,schema:CollegeOrUniversity ) )
} GROUP BY ?subject
`;

const loadGlobalQuery = (
  query: string
) => `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
   ?target ?p ?o .
   ?o ?y ?z.
   ?a ?c ?d.
   ?a ?b ?target.
}
WHERE {
    ?target ?p ?o .
    ?o ?y ?z .
    ?a ?b ?target;
       ?c ?d.
    FILTER (?target = <${query}>)
    FILTER (?c IN ( rdf:type, rdfs:label ) )
    FILTER (?y IN ( rdf:type, rdfs:label ) )
}`;

export interface Match {
  uri: string;
  label: string;
}

export interface SearchDialogProps {
  dataSource: DataSource;
  queryLocal?: (query: string) => Match[];
  selectLocal: (uri: string) => void;
  runSparql: (sparql: string) => void;
  show: boolean;
  close: () => void;
}

export function SearchDialog(props: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [globalResults, setGlobalResults] = useState<Match[] | null>(null);
  const [localResults, setLocalResults] = useState<Match[] | null>(null);
  const [error, setError] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    setIsLoading(true);
    props.dataSource.getForSparql(searchQuery(debouncedQuery)).then(
      (result) => {
        setIsLoading(false);
        setGlobalResults(
          result.tabular?.data.map((row) => ({
            uri: row['subject'].value,
            label: row['label'].value,
          })) || null
        );
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error: { message: string }) => {
        setIsLoading(false);
        setError(error);
      }
    );
  }, [props.dataSource, debouncedQuery]);

  useEffect(() => {
    setLocalResults(
      props.queryLocal && debouncedQuery
        ? props.queryLocal(debouncedQuery)
        : null
    );
  }, [props.queryLocal, debouncedQuery]);

  let localOptions = null;
  if (localResults && localResults?.length > 0) {
    localOptions = (
      <>
        <div className="text-xs text-gray-600 px-2 border-b border-gray-300">
          Local Results
        </div>
        {localResults.map((match) => (
          <button
            onClick={() => {
              props.selectLocal(match.uri);
            }}
            key={match.uri}
            className="w-full flex justify-between border-b border-gray-300 hover:bg-gray-200"
          >
            <div className="py-1 px-2">{match.label}</div>
            <div className="border-l border-gray-200 p-1 px-2 text-sm flex text-gray-600 leading-6 items-center">
              <span>Select</span>
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </div>
          </button>
        ))}
      </>
    );
  }

  let globalOptions = null;
  if (globalResults && globalResults.length > 0) {
    globalOptions = (
      <>
        {globalResults.map((match) => (
          <button
            onClick={() => {
              props.runSparql(loadGlobalQuery(match.uri));
              props.close();
            }}
            key={'global_' + match.uri}
            className="w-full flex justify-between border-b border-gray-300 hover:bg-gray-200"
          >
            <div className="py-1 px-2">{match.label}</div>
            <div className="border-l border-gray-200 p-1 px-2 text-sm flex text-gray-600 leading-6 items-center">
              <span>Select</span>
              <CloudDownloadIcon className="w-5 h-5 ml-2" />
            </div>
          </button>
        ))}
      </>
    );
  } else if (isLoading) {
    globalOptions = (
      <div className="text-gray-600 text-center py-1 px-1">
        We are checking the database...
      </div>
    );
  } else if (error) {
    globalOptions = (
      <div className="text-gray-600 text-center py-1 px-1">
        Oh, we could not query the server
      </div>
    );
  }

  return (
    <ExploreDialog
      show={props.show}
      close={props.close}
      width="max-w-md"
      title={<label htmlFor="iptSearch">Search</label>}
    >
      <>
        <input
          name="iptSearch"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter your keyword here..."
          className="bg-white block w-full sm:text-sm border-y border-gray-300 p-2"
        />
        {query && (
          <div className="overflow-y-auto max-h-64">
            {localOptions}
            {globalOptions && (
              <div className="text-xs text-gray-600 px-2 border-b border-gray-300">
                Global Results
              </div>
            )}
            {globalOptions}
          </div>
        )}
        <div className="text-xs text-gray-400 px-2 py-0.5">
          Hint: press{' '}
          <span className="border border-gray-200 px-1 bg-gray-100 rounded mb-1">
            esc
          </span>{' '}
          to close the dialog
        </div>
      </>
    </ExploreDialog>
  );
}

export default SearchDialog;

// Hook from https://usehooks.com/useDebounce/
function useDebounce<T>(value: T, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
