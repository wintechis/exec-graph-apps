import { DataSet } from './graph-types';
import * as g from 'graphology';

/**
 * Service interface to load knowledge graph related data
 *
 * Implementations can choose to load from a file, keep track of their own data or make request to external databases.
 */
export interface DataSource {
  getAll(): Promise<DataSet>;
  getForSparql(sparql: string): Promise<DataSet>;
  addInformation(oldGraph: g.default, sparql: string): Promise<DataSet>;
}
