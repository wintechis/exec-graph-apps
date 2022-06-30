import { DataSet, getObjectLabel, Schema } from '@exec-graph/graph/types';
import Connections from '../connections/connections';
import DetailEntry from '../detail-entry/detail-entry';
import { extractNodeInformation } from '../graph.utils';
import { renderRdfTerm } from '../rdf-rendering.utils';
import { toTitleCase, URI_REGEX } from '../string.utils';

/**
 * Formats the labels to be consistent
 *
 * @param label might be an RDF URI or the associated label
 */
function formatLabel(label: string): string {
  return URI_REGEX.test(label) ? label : toTitleCase(label);
}

/**
 * Type definition of mandatory and optional properties of the {@link DetailView} component
 */
export interface DetailViewProps {
  data: DataSet;
  selectedObject: string;
  schema: Schema;
  onSelect: (selectedObject: string) => void;
}

const PROPERTY_WIKIDATA_LOGO = 'http://www.wikidata.org/prop/direct/P154';
const PROPERTY_WIKIDATA_IMAGE = 'http://www.wikidata.org/prop/direct/P18';

/**
 * Displays the details of a selected node in the graph
 *
 * @category React Component
 * @author juliusstoerrle
 */
export function DetailView(props: DetailViewProps) {
  const graph = props.data.graph;

  if (!graph || !graph.hasNode(props.selectedObject)) {
    return <h3>Failed to load information for selected object</h3>;
  }

  /**
   * Extracts a label for an graph object without erroring if not defined
   *
   * @param uri object to get a label for
   * @returns the label or uri
   */
  const getObjectLabelFromGraph = (uri: string) =>
    getObjectLabel(uri, graph.hasNode(uri) ? graph.getNodeAttributes(uri) : {});

  const selectedNodeAttrs = graph?.getNodeAttributes(props.selectedObject);
  const types = props.schema.nodePredicates
    .flatMap((nodePredicate) => selectedNodeAttrs[nodePredicate])
    .filter((v) => v != null)
    .map(getObjectLabelFromGraph)
    .join(', ');
  const attributesToDisplay = extractNodeInformation(
    selectedNodeAttrs,
    props.schema
  ).filter(
    ([k, v]) => k !== PROPERTY_WIKIDATA_LOGO && k !== PROPERTY_WIKIDATA_IMAGE
  );

  const img =
    selectedNodeAttrs[PROPERTY_WIKIDATA_LOGO] ||
    selectedNodeAttrs[PROPERTY_WIKIDATA_IMAGE] ? (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        className="ml-auto max-w-xs md:max-w-sm w-[7rem] sm:w-[20%] max-h-[10rem] object-contain"
        src={
          selectedNodeAttrs[PROPERTY_WIKIDATA_LOGO] ||
          selectedNodeAttrs[PROPERTY_WIKIDATA_IMAGE]
        }
        alt="Logo or picture of selected object"
      ></img>
    ) : null;

  return (
    <div className="px-4 py-5 bg-white space-y-6 sm:p-6 overflow-x-auto">
      <div className="flex flex-wrap xs:flex-wrap">
        <div className="max-w-prose mb-2">
          <h3 className="text-2xl font-bold leading-6">
            {getObjectLabel(props.selectedObject, selectedNodeAttrs)}
          </h3>
          <span>{types}</span>
        </div>
        {img}
      </div>
      <div>
        <h3 className="text-lg font-bold leading-6 mb-2">Details</h3>
        {attributesToDisplay.map(([k, v]) => (
          <DetailEntry
            label={formatLabel(getObjectLabelFromGraph(k))}
            value={renderRdfTerm(v, false, (uri) =>
              getObjectLabelFromGraph(uri)
            )}
          ></DetailEntry>
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
