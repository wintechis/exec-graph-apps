import { DataSource } from '@exec-graph/graph/types';
import Dialog from '@exec-graph/ui-react/dialog';
import { useEffect, useState } from 'react';
import { HiOutlineChevronRight, HiOutlineCloudDownload } from 'react-icons/hi';

/**
 * Function that returns a templated query to make a keyword search on a sparql endpoint
 */
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

/**
 * Function that returns a templated query to load all  details and neighbours of a passed node
 */
const loadGlobalQuery = (
  query: string
) => `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
  ?target ?p ?o;
    ?p1 ?o1.
  ?o ?y ?z.
  ?a ?c ?d.
  ?a ?b ?target.
}
WHERE {
  ?target ?p ?o;
    ?p1 ?o1.
  ?o ?y ?z.
  ?a ?b ?target;
    ?c ?d.
  FILTER (?target = <${query}>)
  #FILTER (?c IN ( rdf:type, rdfs:label ) )
  #FILTER (?y IN ( rdf:type, rdfs:label ) )
  #FILTER (?p1 IN ( rdf:type, rdfs:label ) )
}`;

/**
 * A single entry in the result list of the {@link SearchDialog}
 */
export interface Match {
  uri: string;
  label: string;
}

/**
 * Type definition of mandatory and optional properties of the {@link SearchDialog} component
 */
export interface SearchDialogProps {
  /**
   * {@link DataSource} to fetch remote matches from
   */
  dataSource: DataSource;
  /**
   * Function called upon query change to retrieve a list of data which is locally available
   */
  queryLocal?: (query: string) => Match[];
  /**
   * Invoked if user selected a match that is available locally
   */
  selectLocal: (uri: string) => void;
  /**
   * Invoked if user selected a remote match with a query to load a suitable dataset around the match
   */
  runSparql: (sparql: string) => void;
  /**
   * If true, search dialog is displayed
   */
  show: boolean;
  /**
   * Invoked if search is canceled
   */
  close: () => void;
}

/**
 * Renders a dialog with search box and list of results. The dialog can provide the user with local results of the current dataset and results from the entire knowledge graph.
 *
 * @internal The results of the local and global searches are stored in the state and initated by effect hooks to make it asynchron and the UI more reactive.
 *
 * @category React Component
 */
export function SearchDialog(props: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [localMatches, setLocalMatches] = useState<Match[] | null>(null);
  const [globalMatches, setGlobalMatches] = useState<Match[] | null>(null);
  const [errorLoadingGlobalMatches, setErrorLoadingGlobalMatches] = useState<
    object | null
  >(null);
  const [isLoadingGlobalMatches, setIsLoadingGlobalMatches] = useState(false);
  /**
   * @var debounceQuery Only changes the debouncedQuery to query if query did not change for min. 500ms. Used to keep the effect hooks efficient while the user still types.
   */
  const debouncedQuery = useDebounce(query.toLocaleLowerCase(), 500);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setIsLoadingGlobalMatches(false);
      setGlobalMatches(null);
      return;
    }
    setIsLoadingGlobalMatches(true);
    props.dataSource.getForSparql(searchQuery(debouncedQuery)).then(
      (result) => {
        setIsLoadingGlobalMatches(false);
        setGlobalMatches(
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
        setIsLoadingGlobalMatches(false);
        setErrorLoadingGlobalMatches(error);
      }
    );
  }, [props.dataSource, debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setLocalMatches(null);
      return;
    }
    console.log('running local', debouncedQuery);
    setLocalMatches(
      props.queryLocal && debouncedQuery
        ? props.queryLocal(debouncedQuery)
        : null
    );
  }, [props.queryLocal, debouncedQuery]);

  let localOptions = null;
  if (localMatches && localMatches?.length > 0) {
    localOptions = (
      <>
        <div className="text-xs text-gray-600 px-2 border-b border-gray-300">
          Matches in the current graph
        </div>
        {localMatches.map((match) => (
          <button
            onClick={() => {
              props.selectLocal(match.uri);
            }}
            key={match.uri}
            className="w-full flex justify-between border-b border-gray-300 hover:bg-gray-200 text-start"
          >
            <div className="py-1 px-2">{match.label}</div>
            <div className="border-l border-gray-200 p-1 px-2 text-sm flex text-gray-600 leading-6 items-center">
              <span>Select</span>
              <HiOutlineChevronRight className="w-5 h-5 ml-2" />
            </div>
          </button>
        ))}
      </>
    );
  }

  let globalOptions = null;
  if (globalMatches && globalMatches.length > 0) {
    globalOptions = (
      <>
        {globalMatches.map((match) => (
          <button
            onClick={() => {
              props.runSparql(loadGlobalQuery(match.uri));
              props.close();
            }}
            key={'global_' + match.uri}
            className="w-full flex justify-between border-b border-gray-300 hover:bg-gray-200 text-start"
          >
            <div className="py-1 px-2">{match.label}</div>
            <div className="border-l border-gray-200 p-1 px-2 text-sm flex text-gray-600 leading-6 items-center">
              <span>Select</span>
              <HiOutlineCloudDownload className="w-5 h-5 ml-2" />
            </div>
          </button>
        ))}
      </>
    );
  } else if (isLoadingGlobalMatches) {
    globalOptions = (
      <div className="text-gray-600 text-center text-sm py-2 px-1">
        We are checking the database...
      </div>
    );
  } else if (errorLoadingGlobalMatches) {
    globalOptions = (
      <div className="text-gray-600 text-center text-sm py-2 px-1">
        Oh, we could not query the server
      </div>
    );
  }

  return (
    <Dialog
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
                Matches in the entire ExecGraph
              </div>
            )}
            {globalOptions}
          </div>
        )}
        <div className="text-xs text-gray-400 border-t border-gray-300 px-2 py-0.5">
          Hint: press{' '}
          <span className="border border-gray-200 px-1 bg-gray-100 rounded mb-1">
            esc
          </span>{' '}
          to close the dialog
        </div>
      </>
    </Dialog>
  );
}

export default SearchDialog;

/**
 * Custom React hook to propagate a value only if it did not change for a given time delay
 *
 * @see Hook from https://usehooks.com/useDebounce
 * @param value the value to check and propagate
 * @param delay the time to check for changes in ms
 *
 */
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
