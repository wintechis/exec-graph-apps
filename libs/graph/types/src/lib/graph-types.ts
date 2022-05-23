import Graph from 'graphology';

export interface RdfValue {
  value: string;
  type: 'uri' | 'literal';
}

/**
 * Embodies the result which a {@link DataSource} provides.
 *
 * Depending on the query to the {@link DataSource} the data can be in a different format.
 */
export interface DataSet {
  graph?: Graph;
  tabular?: {
    headers: string[];
    data: { [varkey: string]: RdfValue }[];
  };
}
