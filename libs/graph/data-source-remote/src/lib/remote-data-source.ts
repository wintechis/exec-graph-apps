import * as g from 'graphology';
import {
  AddToGraphBuilder,
  DEFAULT_SCHEMA,
  GraphBuilder,
  RdfToGraphTranslator,
} from '@exec-graph/graph/data-source';
import {
  DataSet,
  DataSource,
  Schema,
  DataSourceRequestStatus,
  StatusCallback,
} from '@exec-graph/graph/types';
import { Parser } from 'n3';
import { SparqlRepository } from './sparql/sparql-repository';
import { SparqlValidator } from './sparql/sparql-validator';

/**
 * Utilises a remote SPARQL Endpoint to fetch data
 */
export class RemoteDataSource implements DataSource {
  private sparqlValidator: SparqlValidator;

  constructor(
    private readonly sparqlRepository: SparqlRepository,
    private readonly schema: Schema = DEFAULT_SCHEMA
  ) {
    this.sparqlValidator = new SparqlValidator();
  }

  /**
   * @inheritdoc
   */
  getAll(statusCallback?: StatusCallback): Promise<DataSet> {
    const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';
    return this.queryGraph(query, statusCallback);
  }

  /**
   * @inheritdoc
   */
  getForSparql(
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet> {
    const queryType = this.sparqlValidator.queryTypeOf(sparql);
    switch (queryType) {
      case 'SELECT':
        return this.select(sparql, statusCallback);
      case 'CONSTRUCT':
      case 'DESCRIBE':
        return this.queryGraph(sparql, statusCallback);
      default:
        throw new Error('Query type not supported');
    }
  }

  /**
   * Processes sparql queries that produce a graph
   *
   * @param sparql a SPARQL CONSTRUCT or DESCRIBE query
   * @returns DataSet with graph data
   */
  private queryGraph(
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet> {
    statusCallback?.(DataSourceRequestStatus.LOADING_DATA);
    return this.sparqlRepository.construct(sparql).then((res) => {
      statusCallback?.(DataSourceRequestStatus.PROCESSING_DATA);
      const graphBuilder = new GraphBuilder(
        { multi: true, type: 'directed' },
        new RdfToGraphTranslator(DEFAULT_SCHEMA)
      );

      const parser = new Parser();
      const quads = parser.parse(res);
      graphBuilder.addQuads(quads);

      const graph = graphBuilder.getGraph();
      return { graph, schema: this.schema };
    });
  }

  /**
   * @inheritdoc
   */
  public addInformation(
    oldGraph: g.default,
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet> {
    statusCallback?.(DataSourceRequestStatus.LOADING_DATA);
    return this.sparqlRepository.construct(sparql).then((res) => {
      statusCallback?.(DataSourceRequestStatus.PROCESSING_DATA);
      const graphBuilder = new AddToGraphBuilder(
        oldGraph,
        new RdfToGraphTranslator(DEFAULT_SCHEMA)
      );

      const parser = new Parser();
      const quads = parser.parse(res);
      graphBuilder.addQuads(quads);

      const graph = graphBuilder.getGraph();
      return { graph, schema: this.schema };
    });
  }

  /**
   * Processes sparql queries that produce tabular data only
   *
   * @param sparql a SPARQL SELECT query
   * @returns DataSet with tabulae data
   */
  private select(
    sparql: string,
    statusCallback?: StatusCallback
  ): Promise<DataSet> {
    statusCallback?.(DataSourceRequestStatus.LOADING_DATA);
    return this.sparqlRepository.select(sparql).then((res) => {
      statusCallback?.(DataSourceRequestStatus.PROCESSING_DATA);
      const tabular = {
        headers: res.head.vars,
        data: res.results.bindings,
      };
      return { tabular, schema: this.schema };
    });
  }
}
