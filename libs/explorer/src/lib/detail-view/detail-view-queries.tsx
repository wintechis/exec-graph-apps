/**
 * Returns a query to load details for one node from ExecGraph
 *
 * @param selected uri of the object to load details for
 * @returns build query
 */
export function detailQuery(selected: string): string {
  return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
    CONSTRUCT {
       ?s rdf:type ?t1 .
       ?o rdf:type ?t2 .
       ?target ?p ?o .
       ?s ?p1 ?target .
       ?s rdfs:label ?l1 .
       ?o rdfs:label ?l2 .
       ?p rdf:type ?pt .
       ?p1 rdf:type ?p1t .
       ?p rdfs:label ?pl .
       ?p1 rdfs:label ?p1l .
    }
    WHERE {
        ?target ?p ?o .
        ?s ?p1 ?target .
        OPTIONAL {?o rdf:type ?t2 }.
        OPTIONAL {?s rdf:type ?t1 }.
        OPTIONAL {?o rdfs:label ?l2 }.
        OPTIONAL {?s rdfs:label ?l1 }.
        OPTIONAL {?p rdf:type ?pt }.
        OPTIONAL {?p1 rdf:type ?p1t }.
        OPTIONAL {?p rdfs:label ?pl }.
        OPTIONAL {?p1 rdfs:label ?p1l }.
        FILTER (?target = <${selected}>) 
    }`;
}

/**
 * Returns a query that enables adding wikidata details to execgraph entity
 *
 * @param selected uri of the object to load details for
 * @param sameas uri of the object in the wikidata graph
 * @returns build query
 */
export function wikidataQuery(selected: string, sameas: string) {
  return `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
    CONSTRUCT {
      <${selected}>?p ?ol .
      ?p rdfs:label ?propLabel .
      ?p <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?propType .
    }
    WHERE {
        ?target ?p ?o .
        OPTIONAL {?o rdfs:label ?l2 filter(lang(?l2) = "en") }.
        FILTER (?target = <${sameas}>) 
        FILTER (isURI(?o) || isNumeric(?o) || LANGMATCHES(lang(?o),"en") || lang(?o) = "" )
        BIND (IF(bound($l2), ?l2, ?o) as ?ol)
  
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } 
        ?prop wikibase:directClaim ?p .
        ?prop <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?propType .
    }`;
}
