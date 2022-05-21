import { DEFAULT_SCHEMA, GraphBuilder, RdfToGraphTranslator } from '@exec-graph/graph/data-source';
import { DataSet, DataSource } from '@exec-graph/graph/types';
import { Parser } from 'n3';
import { SparqlRepository } from './sparql-repository';

export class RemoteDataSource implements DataSource {
  constructor(private readonly sparqlRepository: SparqlRepository) {}

  getAll(): Promise<DataSet> {
    const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';
    return this.sparqlRepository.construct(query).then((res) => {
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
}
