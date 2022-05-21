import Graph from 'graphology';

/**
 * Embodies the result which a {@link DataSource} provides.
 *
 * Depending on the query to the {@link DataSource} the data can be in a different format.
 */
export interface DataSet {
  graph?: Graph;
  tabular?: {
    headers: string[];
    data: object[];
  };
}
