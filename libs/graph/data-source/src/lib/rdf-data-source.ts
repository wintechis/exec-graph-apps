import { DataSet, DataSource, Schema } from '@exec-graph/graph/types';
import { Parser, ParserOptions, Quad } from 'n3';
import { GraphBuilder } from './graph-builder';
import { RdfToGraphTranslator } from './rdf-to-graph-translator';

/**
 * Simple DataSource, that makes an RDF string available as
 * {@link DataSet} using n3.js
 *
 * It must be configured through the consturctor with the
 * RDF source, a {@link Schema} and optionally the configuration
 * for the parser (e.g. when processing text/n3 files).
 *
 * @author juliusstoerrle
 */
export class RdfDataSource implements DataSource {
  constructor(
    private readonly rdf: string,
    private readonly schema: Schema,
    private readonly parserOptions: ParserOptions = {}
  ) {}

  /**
   * Process the entire provided RDF string and returns it as a DataSet
   *
   * @returns {@link DataSet}
   */
  getAll(): Promise<DataSet> {
    const parser = new Parser(this.parserOptions);
    const quads = parser.parse(this.rdf);

    const graphBuilder = new GraphBuilder(
      { multi: true, type: 'directed' },
      new RdfToGraphTranslator(this.schema)
    );
    graphBuilder.addQuads(quads);
    const graph = graphBuilder.getGraph();

    return Promise.resolve({ graph, schema: this.schema });
  }

  getForSparql(sparql: string): Promise<DataSet> {
    throw new Error('Method not implemented.');
  }
}
