import { DataSet } from './graph-types';

export interface DataSource {
  getAll(): DataSet;
}
