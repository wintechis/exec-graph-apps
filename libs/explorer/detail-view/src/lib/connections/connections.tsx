import { getObjectLabel } from '@exec-graph/graph/types';
import { ButtonToggle } from '@exec-graph/ui-react/button-toggle';
import Graph from 'graphology';
import { NeighborEntry } from 'graphology-types';
import { Component } from 'react';
import DetailEntry from '../detail-entry/detail-entry';
import { EdgeDirection, getNeighborsOf, getEdgesOf } from '../graph.utils';
import { renderClickableObjectLabel } from '../rdf-rendering.utils';

/**
 * Description of the data structure when listing connections grouped by relationship
 */
interface RelationshipFirstStructure {
  [relation: string]: [
    { neighbor: string; attributes: { [name: string]: unknown } }
  ];
}

/**
 * Type definition of mandatory and optional properties of the {@link Connections} component
 */
export interface ConnectionsProps {
  /** The graph to pull neighbours from */
  graph: Graph;
  /** URI of the central object */
  selectedObject: string;
  /** event handler if user selected a neighbour */
  onSelect: (selectedObject: string) => void;
}

/**
 * Strategies to group neighboring nodes
 */
enum Grouping {
  BY_RELATION,
  BY_OBJECT,
}

/**
 * Type definition of the internal state of the {@link Connections} component
 */
interface ConnectionsState {
  grouping: Grouping;
  directionFilter: EdgeDirection;
}

/**
 * Configures the default state for the {@link Connections} component
 *
 * OUTBOUND seems a good default, inbound mirrors data in ExecGraph, All therefore results in duplicates. Exceptions are Positions/Audits which do not have inversed relations
 */
const STATE_DEFAULT: ConnectionsState = {
  grouping: Grouping.BY_RELATION,
  directionFilter: EdgeDirection.OUTBOUND,
};

/**
 * Renders a block to display all connections, including a toolbar to customise displayed data
 *
 * @category React Component
 */
export class Connections extends Component<ConnectionsProps, ConnectionsState> {
  constructor(props: ConnectionsProps) {
    super(props);
    this.state = STATE_DEFAULT;
    this.setDirectionFilter = this.setDirectionFilter.bind(this);
    this.setGrouping = this.setGrouping.bind(this);
  }

  /**
   * Configure the filter for edge directionality
   *
   * @param directionFilter the edge directionalities to include
   */
  private setDirectionFilter(directionFilter: EdgeDirection): void {
    this.setState({ directionFilter });
  }

  /**
   * Configure the grouping mechanism
   *
   * @param grouping the grouping method to use
   */
  private setGrouping(grouping: Grouping): void {
    this.setState({ grouping });
  }

  /**
   * Renders an entry per neighbour
   */
  private renderNeighborsGroupedByObject(
    neighbors: IterableIterator<NeighborEntry>,
    edgeGetter: (target: string) => string[]
  ): JSX.Element[] {
    const getObjectLabelFromGraph = (uri: string) =>
      getObjectLabel(
        uri,
        this.props.graph.hasNode(uri)
          ? this.props.graph.getNodeAttributes(uri)
          : {}
      );
    const neighborsOutput: JSX.Element[] = [];
    for (const entry of neighbors) {
      neighborsOutput.push(
        <div className="mb-4">
          <span className="">
            {renderClickableObjectLabel(
              entry.neighbor,
              entry.attributes,
              this.props.onSelect
            )}
          </span>
          {edgeGetter(entry.neighbor).map((relationPredicate) => (
            <DetailEntry
              key={relationPredicate}
              label="Relationship"
              value={getObjectLabelFromGraph(relationPredicate)}
            ></DetailEntry>
          ))}
        </div>
      );
    }
    return neighborsOutput;
  }

  /**
   * Renders an entry per relationship after regrouping neighbours with {@link mapToRelationshipFirstStructure}
   */
  private renderNeighborsGroupedByRelationship(
    neighbors: IterableIterator<NeighborEntry>,
    edgeGetter: (target: string) => string[]
  ): JSX.Element[] {
    const getObjectLabelFromGraph = (uri: string) =>
      getObjectLabel(
        uri,
        this.props.graph.hasNode(uri)
          ? this.props.graph.getNodeAttributes(uri)
          : {}
      );
    const output: JSX.Element[] = [];
    const structure: RelationshipFirstStructure =
      this.mapToRelationshipFirstStructure(neighbors, edgeGetter);
    for (const [relationship, objects] of Object.entries(structure)) {
      output.push(
        <div className="mb-4" key={relationship}>
          <span className="font-bold">
            {getObjectLabelFromGraph(relationship)} ({objects.length})
          </span>
          <div className="flex flex-wrap">
            {objects.map(({ neighbor, attributes }) => (
              <div className="mr-4" key={neighbor}>
                {renderClickableObjectLabel(
                  neighbor,
                  attributes,
                  this.props.onSelect
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return output;
  }

  /**
   * Regroups the neighbours by relationships
   *
   * @param neighbors
   */
  private mapToRelationshipFirstStructure(
    neighbors: IterableIterator<NeighborEntry>,
    edgeGetter: (target: string) => string[]
  ): RelationshipFirstStructure {
    const structure: RelationshipFirstStructure = {};
    for (const entry of neighbors) {
      edgeGetter(entry.neighbor).forEach((edgePredicate) => {
        if (structure[edgePredicate]) {
          structure[edgePredicate].push(entry);
        } else {
          structure[edgePredicate] = [entry];
        }
      });
    }
    return structure;
  }

  /**
   * Renders all connections based on the selection and control elements to modify the display
   *
   * @returns section to include on the detail page
   */
  public override render(): JSX.Element {
    const neighbors = getNeighborsOf(
      this.props.selectedObject,
      this.props.graph,
      this.state.directionFilter
    );
    const edgeGetter = (target: string) =>
      getEdgesOf(
        this.props.selectedObject,
        target,
        this.props.graph,
        this.state.directionFilter
      ).map((e) => String(this.props.graph.getEdgeAttribute(e, 'predicate')));
    const neighborsOutput: JSX.Element[] =
      this.state.grouping === Grouping.BY_RELATION
        ? this.renderNeighborsGroupedByRelationship(neighbors, edgeGetter)
        : this.renderNeighborsGroupedByObject(neighbors, edgeGetter);

    return (
      <div>
        <h3 className="text-lg font-bold leading-6">Connections</h3>
        <div className="flex mt-2 mb-4">
          <ButtonToggle
            onChange={this.setGrouping}
            selected={this.state.grouping}
            label="Group by"
            options={[
              { value: Grouping.BY_RELATION, label: 'Relation' },
              { value: Grouping.BY_OBJECT, label: 'Object' },
            ]}
          ></ButtonToggle>
          <ButtonToggle
            className="ml-2"
            onChange={this.setDirectionFilter}
            selected={this.state.directionFilter}
            label="Edges"
            options={[
              { value: EdgeDirection.OUTBOUND, label: 'Outbound' },
              { value: EdgeDirection.INBOUND, label: 'Inbound' },
              { value: EdgeDirection.ALL, label: 'All' },
            ]}
          ></ButtonToggle>
        </div>
        {neighborsOutput}
      </div>
    );
  }
}

export default Connections;
