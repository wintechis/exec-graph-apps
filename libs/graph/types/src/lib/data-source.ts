import { DataSet } from './graph-types';

export interface DataSource {
  getAll(): Promise<DataSet>;
  getForSparql(sparql: string): Promise<DataSet>;
}
