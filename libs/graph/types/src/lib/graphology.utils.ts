import * as g from 'graphology';

/**
 * Tries to extract a human friendly name for an object uri out of the given attributes
 *
 * @param name object uri
 * @param attibutes attributes relating to the object which may contain a label
 */
export function getObjectLabel(
  name: string,
  attributes: { [key: string]: unknown }
): string {
  return String(
    attributes['http://www.w3.org/2000/01/rdf-schema#label'] || name
  ).replace(/^"?(.*?)"?(?:@en)?$/g, '$1');
}

/**
 * Re-export of the graph type for easier typing
 */
export class Graph extends g.default {}
