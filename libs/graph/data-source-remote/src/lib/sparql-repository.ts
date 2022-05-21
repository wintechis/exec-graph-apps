import { HttpClient, HttpMethod } from './http/http-client';

/**
 * The format of the JSON object returned from an SPARQL endpoint
 */
export interface SparqlResponse {
  head: { vars: string[] };
  results: { bindings: object[] };
}

/**
 * Takes different SPARQL queries and makes requests to the given endpoint.
 * The results are parsed into the expected format.
 */
export interface SparqlRepository {
  /**
   * Make a SELECT query, returning the
   * @param query Should be used to send a SELECT query
   */
  select(query: string): Promise<SparqlResponse>;

  /**
   * Make a CONSTRUCT query to the sparql endpoint, which returns a RDF graph
   *
   * @param query A SPARQL CONSTRUCT query
   * @returns The query response
   */
  construct(query: string): Promise<string>;
}

/**
 * Takes different SPARQL queries and makes HTTP requests to the given endpoint.
 *
 * Was tested against GraphDB 9.11
 */
export class HttpSparqlRepository implements SparqlRepository {
  constructor(
    private readonly endpoint: string,
    private readonly httpClient: HttpClient
  ) {}

  /**
   * @inheritdoc
   */
  public select(query: string): Promise<SparqlResponse> {
    const endpoint = this.endpoint + '?query=' + encodeURIComponent(query);
    const opts = {
      headers: {
        accept: 'application/sparql-results+json',
      },
    };

    return this.httpClient.fetch(HttpMethod.GET, endpoint, opts).then((res) => {
      return res.json();
    });
  }

  /**
   * @inheritdoc
   */
  public construct(query: string): Promise<string> {
    const endpoint = this.endpoint + '?query=' + encodeURIComponent(query);
    const opts = {
      headers: {
        accept: 'text/plain', // GraphDB will return n-triples
      },
    };

    return this.httpClient.fetch(HttpMethod.GET, endpoint, opts).then((res) => {
      return res.text();
    });
  }

  /**
   * Make a DESCRIBE query to the sparql endpoint, which returns RDF
   *
   * @param query A SPARQL DESCRIBE query
   * @returns The query response
   */
  public async describe(query: string): Promise<string> {
    // Describe & construct both return RDF triples, the processing therefore is the same
    return this.construct(query);
  }

  // A method for SPARQL ASK may be added here, it just was not needed yet
}
