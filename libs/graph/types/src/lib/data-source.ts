import { DataSet } from './graph-types';
import * as g from 'graphology';

export interface DataSource {
  getAll(): Promise<DataSet>;
  getForSparql(sparql: string): Promise<DataSet>;
  addInformation(oldGraph: g.default, sparql: string): Promise<DataSet>;
}
