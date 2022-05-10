import Graph from 'graphology';
import { Quad } from 'n3';
import { RdfToGraphTranslator } from './rdf-to-graph-translator';

type GraphOptions = {
  allowSelfLoops?: boolean;
  multi?: boolean;
  type?: 'mixed' | 'directed' | 'undirected';
};

/**
 * Maps from RDF Quads to a Graphology graph using the provided translator.
 *
 * If a quad can not be processed it will be ignored,
 * but a log entry is generated.
 * 
 * @author juliusstoerrle
 */
export class GraphBuilder {
  private graph: Graph;

  constructor(
    readonly graphOptions: GraphOptions,
    private readonly translator: RdfToGraphTranslator
  ) {
    this.graph = new Graph(graphOptions);
  }

  addAsNode(quad: Quad): void {
    const typeAttr = this.translator.quadToAttribute(quad);
    this.graph.addNode(quad.subject.id, { [typeAttr.key]: typeAttr.value });
  }

  addAsEdge(quad: Quad): void {
    if (!this.graph.hasNode(quad.subject.id)) {
      this.logUnkownNodeError('edge', 'subject', quad.subject.id);
      return;
    }
    if (!this.graph.hasNode(quad.object.id)) {
      this.logUnkownNodeError('edge', 'object', quad.object.id);
      return;
    }
    this.graph.addEdge(quad.subject.id, quad.object.id, {
      predicate: quad.predicate.id,
    });
  }

  addAsAttributeToNode(quad: Quad): void {
    if (!this.graph.hasNode(quad.subject.id)) {
      this.logUnkownNodeError('attribute', 'subject', quad.subject.id);
      return;
    }
    const typeAttr = this.translator.quadToAttribute(quad);
    this.graph.mergeNodeAttributes(quad.subject.id, {
      [typeAttr.key]: typeAttr.value,
    });
  }

  /**
   * Takes a list of quads and adds each to the graph using
   * the @see RdfToGraphTranslator.
   * 
   * @param quads list of quads from an RDF document
   */
  public addQuads(quads: Quad[]): void {
    quads.forEach((quad: Quad) => {
      if (this.translator.isNode(quad)) {
        this.addAsNode(quad);
      } else if (this.translator.isEdge(quad)) {
        this.addAsEdge(quad);
      } else if (this.translator.isNodeAttribute(quad)) {
        this.addAsAttributeToNode(quad);
      } else {
        console.log(
          'Warning: Could not add quad due to unknown predicate: ' +
            quad.predicate.id
        );
      }
    });
  }

  public getGraph(): Graph {
    return this.graph;
  }

  private logUnkownNodeError(
    triedToAddQuadAs: string,
    term: string,
    id: string
  ): void {
    console.log(
      `Warning: Could not add quad as ${triedToAddQuadAs}, ${term} not a known node: ${id}`
    );
  }
}
