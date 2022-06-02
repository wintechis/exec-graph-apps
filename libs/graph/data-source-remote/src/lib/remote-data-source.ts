import {
  DEFAULT_SCHEMA,
  GraphBuilder,
  RdfToGraphTranslator,
} from '@exec-graph/graph/data-source';
import { DataSet, DataSource, Schema } from '@exec-graph/graph/types';
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
  getAll(): Promise<DataSet> {
    const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';
    return this.queryGraph(query);
  }

  /**
   * @inheritdoc
   */
  getForSparql(sparql: string): Promise<DataSet> {
    const queryType = this.sparqlValidator.queryTypeOf(sparql);
    switch (queryType) {
      case 'SELECT':
        return this.select(sparql);
      case 'CONSTRUCT':
      case 'DESCRIBE':
        return this.queryGraph(sparql);
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
  private queryGraph(sparql: string): Promise<DataSet> {
    return this.sparqlRepository.construct(sparql).then((res) => {
      const graphBuilder = new GraphBuilder(
        { multi: true, type: 'directed' },
        new RdfToGraphTranslator(DEFAULT_SCHEMA)
      );

      const parser = new Parser();
      const quads = parser.parse(res);
      graphBuilder.addQuads(quads);

      const graph = graphBuilder.getGraph();
      console.log(graph.order);
      return { graph, schema: this.schema };
    });
  }

  /**
   * Processes sparql queries that produce tabular data only
   *
   * @param sparql a SPARQL SELECT query
   * @returns DataSet with tabulae data
   */
  private select(sparql: string): Promise<DataSet> {
    return this.sparqlRepository.select(sparql).then((res) => {
      const tabular = {
        headers: res.head.vars,
        data: res.results.bindings,
      };
      return { tabular, schema: this.schema };
    });
  }
}
