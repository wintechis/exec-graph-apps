import {
  DEFAULT_SCHEMA,
  GraphBuilder,
  RdfToGraphTranslator,
} from '@exec-graph/graph/data-source';
import { DataSet, DataSource } from '@exec-graph/graph/types';
import { Parser } from 'n3';
import {
  Parser as SparqlParser,
  Query,
  SparqlParser as SparqlParserInterface,
} from 'sparqljs';
import { SparqlRepository } from './sparql-repository';

export class RemoteDataSource implements DataSource {
  private sparqlParser: SparqlParserInterface;

  constructor(private readonly sparqlRepository: SparqlRepository) {
    this.sparqlParser = new SparqlParser();
  }

  getAll(): Promise<DataSet> {
    const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';
    return this.queryGraph(query);
  }

  getForSparql(sparql: string): Promise<DataSet> {
    const parsed = this.sparqlParser.parse(sparql);
    if (parsed.type !== 'query' || !('queryType' in parsed)) {
      throw new Error(
        'Currently, only queries are supported and no modifications.'
      );
    }
    switch (parsed.queryType) {
      case 'SELECT':
        return this.select(sparql);
      case 'CONSTRUCT':
      case 'DESCRIBE':
        return this.queryGraph(sparql);
      default:
        throw new Error('Query type not supported');
    }
  }

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
      return { graph };
    });
  }

  private select(sparql: string): Promise<DataSet> {
    return this.sparqlRepository.select(sparql).then((res) => {
      const tabular = {
        headers: res.head.vars,
        data: res.results.bindings,
      };
      return { tabular };
    });
  }
}
