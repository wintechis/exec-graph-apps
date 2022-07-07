import { Schema } from '@exec-graph/graph/types';
import Graph from 'graphology';
import { NeighborEntry } from 'graphology-types';

/**
 * List of all possible edge directions
 *
 * E.g. to use as filter
 */
export enum EdgeDirection {
  ALL,
  INBOUND,
  OUTBOUND,
}

/**
 * Retuns an iterator of which each entry contains the name
 * and attributes of a neighbor node to the selectedObject.
 *
 * @param edgeFilter Only return edges of the given directionality
 */
export function getNeighborsOf(
  selectedObject: string,
  graph: Graph,
  edgeFilter: EdgeDirection
): IterableIterator<NeighborEntry> {
  if (edgeFilter === EdgeDirection.ALL) {
    return graph?.neighborEntries(selectedObject);
  }
  if (edgeFilter === EdgeDirection.INBOUND) {
    return graph?.inboundNeighborEntries(selectedObject);
  }
  if (edgeFilter === EdgeDirection.OUTBOUND) {
    return graph?.outboundNeighborEntries(selectedObject);
  }
  throw Error('EdgeFilter not implemented');
}

/**
 * Retuns the names of all edges between source and target
 * in the passed graph taking into consideration the passed filter
 *
 * @param edgeFilter Only return edges of the given directionality
 */
export function getEdgesOf(
  source: string,
  target: string,
  graph: Graph,
  edgeFilter: EdgeDirection
): string[] {
  if (edgeFilter === EdgeDirection.ALL) {
    return graph?.edges(source, target);
  }
  if (edgeFilter === EdgeDirection.INBOUND) {
    return graph?.inboundEdges(source, target);
  }
  if (edgeFilter === EdgeDirection.OUTBOUND) {
    return graph?.outboundEdges(source, target);
  }
  throw Error('EdgeFilter value not implemented');
}

/**
 * Returns list of key-value pairs for all rdf based node attributes
 *
 * Note: Nodes may also contain attributes for location or
 * styling, which should not be included
 */
export function extractNodeInformation(
  selectedNodeAttrs: { [name: string]: unknown },
  schema: Schema
): [string, unknown][] {
  return Object.entries(selectedNodeAttrs).filter(([k, v]) =>
    schema.nodeAttributePredicates.includes(k)
  );
}
