import { Graph } from '@exec-graph/graph/types';
import { MultiDirectedGraph } from 'graphology';
import { Quad } from 'n3';
import { RdfToGraphTranslator } from './rdf-to-graph-translator';

/**
 * Options to configure a new graph instances
 */
interface GraphOptions {
  allowSelfLoops?: boolean;
  multi?: boolean;
  type?: 'mixed' | 'directed' | 'undirected';
}

/**
 * Maps from RDF Quads to a Graphology graph using the provided translator.
 *
 * If a quad can not be processed it will be ignored,
 * but a log entry is generated.
 *
 * @author juliusstoerrle
 */
export abstract class AbstractGraphBuilder {
  private retryQuads: Quad[] = [];

  constructor(
    protected readonly graph: Graph,
    protected readonly translator: RdfToGraphTranslator
  ) {}

  /**
   * Takes a quad and adds its subject as a node to the graph or adds its information to an existing node with the same identifier
   *
   * @param quad quad to extract node id and type from
   */
  addAsNode(quad: Quad): void {
    const typeAttr = this.translator.quadToAttribute(quad);
    if (!this.graph.hasNode(quad.subject.id)) {
      this.graph.addNode(quad.subject.id, { [typeAttr.key]: typeAttr.value });
    } else {
      const typeAttr = this.translator.quadToAttribute(quad);
      let value = this.graph.getNodeAttribute(quad.subject.id, typeAttr.key);
      if (!Array.isArray(value)) {
        value = [value];
      }
      value.push(typeAttr.value);
      this.graph.mergeNodeAttributes(quad.subject.id, {
        [typeAttr.key]: value,
      });
    }
  }

  /**
   * Takes a quad and adds a directed egde between its subject and object.
   * @param quad quad to extract edge target, source and type from
   */
  addAsEdge(quad: Quad): void {
    if (!this.graph.hasNode(quad.subject.id)) {
      this.retryQuads.push(quad);
      this.logUnkownNodeError('edge', 'subject', quad.subject.id);
      return;
    }
    if (!this.graph.hasNode(quad.object.id)) {
      this.retryQuads.push(quad);
      this.logUnkownNodeError('edge', 'object', quad.object.id);
      return;
    }
    this.graph.addEdge(quad.subject.id, quad.object.id, {
      predicate: quad.predicate.id,
    });
  }

  /**
   * Takes a quad and adds its predicate and object as attribute to the subjects node
   * @param quad quad to extract attribute key, subject and value from
   */
  addAsAttributeToNode(quad: Quad): void {
    if (!this.graph.hasNode(quad.subject.id)) {
      this.retryQuads.push(quad);
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
   * the {@link RdfToGraphTranslator}.
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

  /**
   * Finalises the graph and returns it
   *
   * @returns the completed graph
   */
  public getGraph(): Graph {
    this.addQuads(this.retryQuads);
    return this.graph;
  }

  /**
   * Create a log statement rather than silently dropping statements relating to unknown nodes
   */
  protected logUnkownNodeError(
    triedToAddQuadAs: string,
    term: string,
    id: string
  ): void {
    /*console.log(
      `Warning: Could not add quad as ${triedToAddQuadAs}, ${term} not a known node: ${id}`
    );*/
  }
}

/**
 * Maps from RDF Quads to a Graphology graph using the provided translator.
 *
 * If a quad can not be processed it will be ignored,
 * but a log entry is generated.
 *
 * @author juliusstoerrle
 */
export class GraphBuilder extends AbstractGraphBuilder {
  constructor(graphOptions: GraphOptions, translator: RdfToGraphTranslator) {
    super(new MultiDirectedGraph({ ...graphOptions, multi: true }), translator);
  }
}

/**
 * Maps from RDF Quads to an existing Graphology graph using the provided translator.
 *
 * If a quad can not be processed it will be ignored,
 * but a log entry is generated.
 *
 * @author juliusstoerrle
 */
export class AddToGraphBuilder extends AbstractGraphBuilder {
  constructor(graph: Graph, translator: RdfToGraphTranslator) {
    super(graph, translator);
  }
}
