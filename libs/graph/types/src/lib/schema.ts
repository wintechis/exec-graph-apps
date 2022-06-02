/**
 * A Schema object defines how triplets were/should be
 * interpreted with respect to transfering them into a
 * graph based view.
 *
 * For example the subject of all quads using the
 * http://www.w3.org/1999/02/22-rdf-syntax-ns#type predicate
 * can be considered nodes.
 */
export interface Schema {
  nodePredicates: string[];
  edgePredicates: string[];
  nodeAttributePredicates: string[];
}
