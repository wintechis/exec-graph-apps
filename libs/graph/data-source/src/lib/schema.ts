import { Schema } from '@exec-graph/graph/types';

/**
 * This default schema allocates a range of common
 * predicates to the different graph elements.
 *
 * It may serve as a starting point or example, however
 * different allocations are possible and new schemas for
 * other ontologies may can be created.
 */
export const DEFAULT_SCHEMA: Schema = {
  nodePredicates: [
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    'http://www.w3.org/1999/02/22/rdf-syntax-ns#type',
  ],
  nodeAttributePredicates: [
    'http://www.w3.org/2000/01/rdf-schema#label',
    'http://schema.org/givenName',
    'http://schema.org/familyName',
    'http://schema.org/honorificPrefix',
    'http://schema.org/gender',
    'http://xmlns.com/foaf/0.1/familyName',
    'http://xmlns.com/foaf/0.1/givenName',
    'http://xmlns.com/foaf/0.1/name',
    'http://dbpedia.org/property/birthYear',
    'http://schema.org/mainEntityOfPage',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#bafinID',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#inDivision',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isCurrent',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isSupervisoryBoard',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isManagementBoard',
    'http://schema.org/roleName',
    'http://schema.org/startDate',
    'http://schema.org/endDate',
    'http://schema.org/tickerSymbol',
  ],
  edgePredicates: [
    'http://execgraph.org/educationConnection',
    'http://execgraph.org/workConnection',
    'http://execgraph.org/birthPlaceConnection',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#dealingWith',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#hasDealing',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#hasAudit',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#audited',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#currentCEO',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isCEO',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#auditedBy',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#studiedAt',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#educatedAt',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isOnSupervisoryBoardOf',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#isOnManagementBoardOf',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#currentEmployee',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#employedInPast',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#currentlyWorksAt',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#hasWorkConnection',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#workConnection',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#educationConnection',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#birthPlaceConnection',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#hasAlumni',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#author',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#birthPlaceOf',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#hasRole',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#pastRolesAt',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#currentManagementBoard',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#currentSupervisoryBoard',
    'https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#roleWith',
    'http://example.org/cartoons#smarterThan',
    'http://xmlns.com/foaf/0.1/knows',
    'http://schema.org/birthPlace',
  ],
};
