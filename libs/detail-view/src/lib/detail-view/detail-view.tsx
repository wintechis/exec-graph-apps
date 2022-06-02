import { DataSet, Schema } from '@exec-graph/graph/types';
import Connections from '../connections/connections';
import DetailEntry from '../detail-entry/detail-entry';
import { extractNodeInformation } from '../graph.utils';
import { getObjectLabel, renderRdfTerm } from '../rdf-rendering.utils';

export interface DetailViewProps {
  data: DataSet;
  selectedObject: string;
  schema: Schema;
  onSelect: (selectedObject: string) => void;
}

/**
 * Displays the details of a selected node in the graph
 *
 * @category React Component
 * @author juliusstoerrle
 */
export function DetailView(props: DetailViewProps) {
  const graph = props.data.graph;
  const selectedNodeAttrs = graph?.getNodeAttributes(props.selectedObject);

  if (!graph || !selectedNodeAttrs) {
    return <h3>Failed to load information for selected object</h3>;
  }

  const types = props.schema.nodePredicates
    .flatMap((nodePredicate) => selectedNodeAttrs[nodePredicate])
    .filter((v) => v != null)
    .map((tUri) =>
      getObjectLabel(
        tUri,
        graph.hasNode(tUri) ? graph.getNodeAttributes(tUri) : {}
      )
    )
    .join(', ');
  const attributesToDisplay = extractNodeInformation(
    selectedNodeAttrs,
    props.schema
  );

  return (
    <div className="px-4 py-5 bg-white space-y-6 sm:p-6 overflow-x-auto">
      <h3 className="text-xl font-bold leading-6">
        {getObjectLabel(props.selectedObject, selectedNodeAttrs)}
      </h3>
      <span>{types}</span>
      <div>
        <h3 className="text-lg font-bold leading-6 mb-2">Details</h3>
        {attributesToDisplay.map(([k, v]) => (
          <DetailEntry label={k} value={renderRdfTerm(v, false)}></DetailEntry>
        ))}
        <DetailEntry
          label="Graph Identifier"
          value={renderRdfTerm(props.selectedObject, false)}
        ></DetailEntry>
      </div>
      <Connections
        graph={graph}
        selectedObject={props.selectedObject}
        onSelect={props.onSelect}
      ></Connections>
    </div>
  );
}

export default DetailView;
