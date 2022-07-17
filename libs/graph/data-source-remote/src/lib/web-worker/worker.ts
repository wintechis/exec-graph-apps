/**
 * This file should be executed as a WebWorker. It wraps a RemoteDataSource
 * and executes queries when notified via messages
 *
 * The worker must first be initalized by sending the sparqlEndpoint URL
 * After initalization queries may be send with a unique id, which will
 * be used accordingly when returning the results
 */

import {
  DataSource,
  DataSourceRequestStatus,
  Graph,
} from '@exec-graph/graph/types';
import { FetchHttpClient } from '../http/fetch-http-client';
import { HttpClient } from '../http/http-client';
import { RemoteDataSource } from '../remote-data-source';
import { HttpSparqlRepository } from '../sparql/sparql-repository';
import { dehydrateDataset } from './utils';

/**
 * The wrapped DataSource the worker uses to make requests.
 */
let dataSource: DataSource | null = null;

self.onmessage = ({ data: { id, action, payload, oldGraph } }) => {
  if (action === 'init') {
    const httpClient: HttpClient = new FetchHttpClient();
    const sparqlRepository = new HttpSparqlRepository(
      payload.sparqlEndpoint,
      httpClient
    );
    dataSource = new RemoteDataSource(sparqlRepository, payload.schema);
  }
  if (action === 'query') {
    if (dataSource == null) {
      self.postMessage({ id, error: 'WebWorker DataSource not initiated' });
      return;
    }
    const callback = (status: DataSourceRequestStatus): void =>
      self.postMessage({ id, status });
    const request =
      oldGraph != null
        ? dataSource.addInformation(Graph.from(oldGraph), payload, callback)
        : dataSource.getForSparql(payload, callback);
    request.then(
      (dataset) =>
        self.postMessage({
          id,
          dataset: dehydrateDataset(dataset),
        }),
      (reason) =>
        self.postMessage({
          id,
          error: reason,
        })
    );
  }
};
