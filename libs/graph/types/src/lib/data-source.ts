import { DataSet } from './graph-types';
import { Graph } from './graphology.utils';

export enum DataSourceRequestStatus {
  LOADING_DATA,
  PROCESSING_DATA,
}

export type StatusCallback = (status: DataSourceRequestStatus) => void;

/**
 * Service interface to load knowledge graph related data
 *
 * Implementations can choose to load from a file, keep track of their own data or make request to external databases.
 */
export interface DataSource {
  /**
   * Returns all triples from the knowledge graph this data source is linked to
   */
  getAll(statusCallback?: StatusCallback): Promise<DataSet>;

  /**
   * Executes the given query against the linked graph
   *
   * @param sparql the SPARQL query to execute
   */
  getForSparql(
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet>;

  /**
   * Executes the given query against the linked graph and adds the information to the existing graph instances.
   *
   * @param oldGraph the graph to add newly loaded data to
   * @param sparql the SPARQL query to execute, must be a CONSTRUCT or DESCRIBE query
   */
  addInformation(
    oldGraph: Graph,
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet>;
}
