import { Disclosure } from '@headlessui/react';
import React from 'react';

/**
 * Type definition for predefined queries in the library
 */
interface Query {
  title: string;
  sparql: string;
}

/**
 * Predefined list of queries relating to the ExecGraph knowledge graph
 */
const LIBRARY: Query[] = [
  {
    title: 'Default',
    sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>
    
CONSTRUCT {?s ?p ?o}
WHERE {
  ?s ?p ?o.
  ?s rdf:type ?c.
  FILTER (?c IN ( schema:City,schema:Person, schema:Organization,schema:CollegeOrUniversity ) )
}`,
  },
  {
    title: 'People',
    sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>
    
CONSTRUCT {?s ?p ?o}
WHERE {
  ?s ?p ?o.
  ?s rdf:type schema:Person.
}`,
  },
  {
    title: 'Audits',
    sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>
        
CONSTRUCT {?s ?p ?o. ?o ?a ?b. ?auditedCompany ?y ?z.}
WHERE {
  ?s ?p ?o.
  ?s rdf:type schema:Review.
  ?auditedCompany?x ?s;
     ?y ?z.
  ?o ?a ?b.
}`,
  },
  {
    title: 'DAX Companies',
    sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    
CONSTRUCT {?s ?p ?o. ?o ?a ?b}
WHERE {
  ?s ?p ?o.
  ?s rdf:type <https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#DAXmember>.
  ?o ?a ?b.
}`,
  },
  {
    title: 'Educational Connections',
    sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
PREFIX schema: <http://schema.org/>
PREFIX execprop: <https://solid.ti.rw.fau.de/public/2021/execgraph/property.ttl#>
  
CONSTRUCT {
  ?s execprop:hasEducationConnection ?o;
   schema:alumniOf ?u;
     rdf:type ?sType;
     rdfs:label ?sLabel.
  ?u rdf:type ?uType.
  ?u rdfs:label ?uLabel.
}
WHERE {
  ?s rdf:type ?sType;
     rdfs:label ?sLabel;
     execprop:educatedAt ?edu.
  OPTIONAL {?s execprop:hasEducationConnection ?o;}
  OPTIONAL {
      ?edu schema:provider ?u.
    ?u rdf:type ?uType.
      ?u rdfs:label ?uLabel.
  }
}`,
  },
];

/**
 * Type definition of mandatory and optional properties of the {@link QueryLibrary} component
 */
export interface QueryLibraryProps {
  /**
   * invoked when user selects a predefined query
   */
  onSelect: (sparql: string) => void;
}

/**
 * Displays a libary of predefined queries which the user can select
 *
 * @category React Component
 * @returns list of default queries to select from
 */
export function QueryLibrary(props: QueryLibraryProps): JSX.Element {
  return (
    <>
      <div className="p-4 border-b border-gray-300">
        <p className="text-sm text-gray-600 max-w-prose">
          Click to select a query from our list of predefined queries:
        </p>
      </div>
      <div className="overflow-y-auto py-2 w-full md:w-max md:min-w-[60%]">
        {LIBRARY.map((entry) => (
          <div className="p-4 py-2" key={entry.title}>
            <button
              onClick={() => props.onSelect(entry.sparql)}
              className="block text-left w-full border border-gray-300 p-4 rounded-md bg-white hover:border-fau-blue"
            >
              <Disclosure>
                {({ open }) => (
                  <>
                    <div className="flex">
                      <span className="font-bold mr-4">{entry.title}</span>
                      <span
                        className="ml-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Disclosure.Button className="border border-gray-300 rounded p-1 px-2 text-gray-600 text-sm">
                          <>{open ? 'Hide' : 'Show'} SPARQL</>
                        </Disclosure.Button>
                      </span>
                      <span className="border border-gray-300 p-1 px-2 bg-fau-blue text-white text-sm rounded ml-2">
                        Select
                      </span>
                    </div>
                    <Disclosure.Panel className="text-gray-500">
                      <pre className="text-xs">{entry.sparql}</pre>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default QueryLibrary;
