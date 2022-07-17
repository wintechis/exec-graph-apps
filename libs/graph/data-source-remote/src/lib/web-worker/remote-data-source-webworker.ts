import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import {
  DataSet,
  DataSource,
  Graph,
  Schema,
  StatusCallback,
} from '@exec-graph/graph/types';
import { hydrateDataset } from './utils';

/**
 * Utilises a remote SPARQL Endpoint to fetch data
 * in the background using web workers.
 *
 * @author Julius Stoerrle
 */
export class RemoteWebWorkerDataSource implements DataSource {
  private worker: Worker;
  private messageId = 0;
  private ongoingQueries: {
    [id: number]: {
      resolve: (value: DataSet | PromiseLike<DataSet>) => void;
      reject: (reason: unknown) => void;
      statusCallback?: StatusCallback;
    };
  } = {};

  constructor(sparqlEndpoint: string, schema: Schema = DEFAULT_SCHEMA) {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    /**
     * Initiate the webworker by sending the remote endpoint url
     */
    this.worker.postMessage({
      action: 'init',
      payload: { sparqlEndpoint, schema },
    });
    /**
     * Process responses from the worker.
     * If the response has a stored query, use the callback
     * functions to notify the client
     */
    this.worker.onmessage = ({ data }) => {
      const { id, dataset, status, error } = data;
      if (dataset != null) {
        const { resolve } = this.ongoingQueries[id];
        resolve(hydrateDataset(dataset));
        delete this.ongoingQueries[id];
        return;
      } else if (status != null) {
        const { statusCallback } = this.ongoingQueries[id];
        if (statusCallback) {
          statusCallback(status);
        }
      } else if (error) {
        const { reject } = this.ongoingQueries[id];
        reject(status);
        delete this.ongoingQueries[id];
      }
    };
  }

  /**
   * @inheritdoc
   */
  public getAll(statusCallback?: StatusCallback): Promise<DataSet> {
    const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';
    return this.getForSparql(query, statusCallback);
  }

  /**
   * @inheritdoc
   */
  public getForSparql(
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet> {
    const id = this.messageId++;
    this.worker.postMessage({ action: 'query', id, payload: sparql });
    return new Promise(
      (resolve, reject) =>
        (this.ongoingQueries[id] = { resolve, reject, statusCallback })
    );
  }

  /**
   * @inheritdoc
   */
  public addInformation(
    oldGraph: Graph,
    sparql: string,
    statusCallback?: StatusCallback | undefined
  ): Promise<DataSet> {
    const id = this.messageId++;
    this.worker.postMessage({
      action: 'query',
      id,
      payload: sparql,
      oldGraph: oldGraph?.export(),
    });
    return new Promise(
      (resolve, reject) =>
        (this.ongoingQueries[id] = { resolve, reject, statusCallback })
    );
  }
}
