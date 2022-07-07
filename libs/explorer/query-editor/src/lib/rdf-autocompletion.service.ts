import { DataSource } from '@exec-graph/graph/types';
import { URI_REGEX } from '@exec-graph/utils';
import { createContext } from 'react';

/**
 * One element in the autocomplete list of {@link RDFTermInput}
 */
export interface Option {
  value: string;
  label?: string;
}

/**
 * Information of a RDF Property needed within the autocompletion service
 */
interface Property {
  uri: string;
  label: string;
  range: string;
}

/**
 * This query returns all properties used in a dataset (not only delcared ones)
 *
 * Taken from: https://sparql-playground.sib.swiss/faq
 */
const QUERY_SELECT_PROPERTIES = `
 SELECT ?property (SAMPLE(?l) AS ?label) (SAMPLE(?r) AS ?range)
 WHERE
 { 
  ?s ?property ?o .
  OPTIONAL { ?property <http://www.w3.org/2000/01/rdf-schema#label> ?l . }
  OPTIONAL { ?property <http://www.w3.org/2000/01/rdf-schema#range> ?r . }
 }
 GROUP BY ?property
`;

const QUERY_AUTOCOMPLETE = (range: string) => `SELECT ?s (SAMPLE(?l) as ?label) 
WHERE { 
?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${range}>.
 OPTIONAL {?s <http://www.w3.org/2000/01/rdf-schema#label> ?l} 
} GROUP BY ?s`;

/**
 * Prepared list of autocomplete list that acts as a default for initating a new {@link RdfAutocompletionState}.
 *
 * It should contain predefined options for the XMLSchema or similar types where appropriate
 */
const DEFAULT_AUTOCOMPLETE: { [range: string]: Option[] } = {
  'http://www.w3.org/2001/XMLSchema#boolean': [
    { value: '1', label: 'True' },
    {
      value: '"0"^^<http://www.w3.org/2001/XMLSchema#boolean>',
      label: 'False',
    },
  ],
};

/**
 * Properties to be stored in a React context keeping track of the autocompletion loading status
 *
 * Use the {@link RdfAutocompletionService} to initiate one and the helper functions to access its contents in a component.
 */
export interface RdfAutocompletionState {
  properties?: Property[] | undefined;
  propertiesAsOptions?: Option[] | undefined;
  autocomplete: { [range: string]: Option[] };
  /**
   * callback function to initiate population of the properties list
   * should be set through the {@link RdfAutocompletionService}
   */
  loadProperties: () => void;
  /**
   * callback function to populare the options for a given range
   * should be set through the {@link RdfAutocompletionService}
   *
   * @param range the range identifier (e.g. URI)
   */
  loadForRange: (range: string) => void;
}

export const RdfAutocompletionContext = createContext<RdfAutocompletionState>({
  autocomplete: DEFAULT_AUTOCOMPLETE,
  loadProperties: () =>
    console.warn('called loadForProperty without initalisation'),
  loadForRange: () =>
    console.warn('called loadForProperty without initalisation'),
});

/**
 * Accessor for the {@link RdfAutocompletionState} to extract the range of a property
 */
export function rangeOf(
  predicate: string,
  state: RdfAutocompletionState
): string | undefined {
  return state.properties?.find((p) => p.uri === predicate)?.range;
}

/**
 * Accessor for the {@link RdfAutocompletionState} to get the options list for a property
 */
export function optionsFor(
  predicate: string,
  state: RdfAutocompletionState
): Option[] {
  const range = rangeOf(predicate, state);
  if (!range) {
    return [];
  }
  if (state.autocomplete[range] != null) {
    return state.autocomplete[range];
  }
  state.loadForRange(range);
  return []; // -- not yet loaded, return empty
}

/**
 * Loads and manages the options to autocomplete SPARQL query elements.
 */
export class RdfAutocompletionService {
  private properties: Property[] | undefined;
  private propertiesAsOptions: Option[] | undefined;

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Initiate a new State object to use in a React context
   */
  public initState(
    /**
     * function to set the state of the context provider for the {@link RdfAutocompletionState}
     */
    patchState: (state: Partial<RdfAutocompletionState>) => void,
    /**
     * function to set retrieve the current {@link RdfAutocompletionState} of the provider
     */
    latestState: () => RdfAutocompletionState
  ): RdfAutocompletionState {
    return {
      properties: this.properties,
      propertiesAsOptions: this.propertiesAsOptions,
      autocomplete: { ...DEFAULT_AUTOCOMPLETE },
      loadForRange: (range: string) => {
        if (range) {
          this.loadAutocomplete(range).then((options) => {
            const state = latestState();
            const autocomplete = { ...state.autocomplete, [range]: options };
            patchState({ ...latestState(), autocomplete });
          });
        }
      },
      loadProperties: () => {
        this.loadProperties().then((updatedState) => patchState(updatedState));
      },
    };
  }

  /**
   * Load autocompletion list for properties
   */
  private loadProperties(): Promise<Partial<RdfAutocompletionState>> {
    return this.dataSource
      .getForSparql(QUERY_SELECT_PROPERTIES)
      .then((data) => {
        if (data.tabular?.data === undefined) {
          throw Error('Failed to load properties for autocompletion');
        }
        this.properties = data.tabular.data.map((row) => ({
          uri: row['property'].value,
          label: row['label']?.value || row['property'].value,
          range: row['range']?.value,
        }));
        this.propertiesAsOptions = this.properties?.map((row) => ({
          value: row.uri,
          label: row.label,
        }));
        return {
          properties: this.properties,
          propertiesAsOptions: this.propertiesAsOptions,
        };
      });
  }

  /**
   * Initiate request for the autocomplete options based on the type of range
   *
   * @param range the uri of the range/class to load autocompletion list for
   * @returns list of options
   */
  private loadAutocomplete(range: string): Promise<Option[]> {
    if (
      URI_REGEX.test(range) &&
      !range.startsWith('http://www.w3.org/2001/XMLSchema#')
    ) {
      return this.dataSource.getForSparql(QUERY_AUTOCOMPLETE(range)).then(
        (data) =>
          data.tabular?.data.map((row) => ({
            value: row['s'].value,
            label: row['label']?.value || row['s'].value,
          })) || []
      );
    }
    console.warn(`Could not determine autoloading strategy for ${range}`);
    return Promise.resolve([]);
  }
}
