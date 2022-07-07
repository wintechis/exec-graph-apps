import { Schema } from '@exec-graph/graph/types';
import { Quad } from 'n3';

/**
 * Utility class to helps to map RDF quads as graph
 * elements using a provided @see Schema.
 *
 * @author juliusstoerrle
 */
export class RdfToGraphTranslator {
  /**
   * @param schema The schema to use for mapping quads to graph elements
   */
  constructor(private schema: Schema) {}

  /**
   * Checks if a quad defines a node based on the provided schema.
   *
   * @param quad the quad to evaluate
   * @returns true if quad defines a node, false otherwise
   */
  public isNode(quad: Quad): boolean {
    return this.schema.nodePredicates.includes(quad.predicate.id);
  }

  /**
   * Checks if a quad defines an endge based on the provided schema.
   *
   * @param quad the quad to evaluate
   * @returns true if quad defines a edge, false otherwise
   */
  public isEdge(quad: Quad): boolean {
    return this.schema.edgePredicates.includes(quad.predicate.id);
  }

  /**
   * Checks if a quad consitutues a information to add to a node based on the provided schema.
   *
   * @param quad the quad to evaluate
   * @returns true if quad should be interpretet as attribute, false otherwise
   */
  public isNodeAttribute(quad: Quad): boolean {
    return this.schema.nodeAttributePredicates.includes(quad.predicate.id);
  }

  /**
   * Extracts the information from a quad that should be
   * kept to describe a graph element.
   *
   * @param quad The original quad
   * @returns the attribute key and its value
   */
  public quadToAttribute(quad: Quad): { key: string; value: string } {
    return { key: quad.predicate.id, value: quad.object.id };
  }
}
