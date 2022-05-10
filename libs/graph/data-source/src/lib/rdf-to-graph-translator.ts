import { Quad } from 'n3';
import { Schema } from './schema';

/**
 * Utility class to helps to map RDF quads as graph
 * elements using a provided @see Schema.
 *
 * @author juliusstoerrle
 */
export class RdfToGraphTranslator {
  constructor(private schema: Schema) {}

  public isNode(quad: Quad) {
    return this.schema.nodePredicates.includes(quad.predicate.id);
  }

  public isEdge(quad: Quad) {
    return this.schema.edgePredicates.includes(quad.predicate.id);
  }

  public isNodeAttribute(quad: Quad) {
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
