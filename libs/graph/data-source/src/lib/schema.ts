/**
 * A Schema object defines how the triplets should be
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

/**
 * This default schema allocates a range of common
 * predicates to the different graph elements.
 *
 * It may serve as a starting point or example, however
 * different allocations are possible and new schemas for
 * other ontologies may can be created.
 */
export const DEFAULT_SCHEMA: Schema = {
  nodePredicates: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
  nodeAttributePredicates: [
    'http://xmlns.com/foaf/0.1/familyName',
    'http://xmlns.com/foaf/0.1/givenName',
    'http://xmlns.com/foaf/0.1/name',
  ],
  edgePredicates: [
    'http://example.org/cartoons#smarterThan',
    'http://xmlns.com/foaf/0.1/knows',
  ],
};
