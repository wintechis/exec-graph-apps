import Graph from 'graphology';
import { Schema } from './schema';

/**
 * Interface is based on how SPARQL endpoints return singular values in the JSON format
 */
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
  schema: Schema;
  graph?: Graph;
  tabular?: {
    headers: string[];
    data: { [varkey: string]: RdfValue }[];
  };
}
