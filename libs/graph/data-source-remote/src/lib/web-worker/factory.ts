import { DataSource, Schema } from '@exec-graph/graph/types';
import { FetchHttpClient } from '../http/fetch-http-client';
import { HttpClient } from '../http/http-client';
import { RemoteDataSource } from '../remote-data-source';
import { HttpSparqlRepository } from '../sparql/sparql-repository';
import { RemoteWebWorkerDataSource } from './remote-data-source-webworker';

/**
 * Initiates the most suitable data source for the given environment
 *
 * If available the web worker variant will be choosen.
 *
 * @param sparqlEndpoint url to request from
 * @param schema Schema to use for mapping result to graph
 * @returns a suitable DataSource depending on the environment
 */
export function RemoteDataSourceFactory(
  sparqlEndpoint: string,
  schema: Schema
): DataSource {
  if (window.Worker) {
    return new RemoteWebWorkerDataSource(sparqlEndpoint, schema);
  }
  const httpClient: HttpClient = new FetchHttpClient();
  const sparqlRepository = new HttpSparqlRepository(sparqlEndpoint, httpClient);
  return new RemoteDataSource(sparqlRepository, schema);
}
