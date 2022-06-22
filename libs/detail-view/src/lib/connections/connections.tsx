import { ButtonToggle } from '@exec-graph/ui-react/button-toggle';
import Graph from 'graphology';
import { NeighborEntry } from 'graphology-types';
import { Component } from 'react';
import DetailEntry from '../detail-entry/detail-entry';
import { EdgeDirection, getNeighborsOf, getEdgesOf } from '../graph.utils';
import {
  getObjectLabel,
  renderClickableObjectLabel,
  renderRdfTerm,
} from '../rdf-rendering.utils';

interface RelationshipFirstStructure {
  [relation: string]: [
    { neighbor: string; attributes: { [name: string]: unknown } }
  ];
}

export interface ConnectionsProps {
  graph: Graph;
  selectedObject: string;
  onSelect: (selectedObject: string) => void;
}

/**
 * Strategies to group neighboring nodes
 */
enum Grouping {
  BY_RELATION,
  BY_OBJECT,
}

interface ConnectionsState {
  grouping: Grouping;
  directionFilter: EdgeDirection;
}

/**
 * Confiugures the default state for the {@link Connections} component
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
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.setDirectionFilter = this.setDirectionFilter.bind(this);
    this.setGrouping = this.setGrouping.bind(this);
  }

  private handleSelectionChange(uri: string) {
    this.props.onSelect(uri);
  }

  private setDirectionFilter(directionFilter: EdgeDirection) {
    this.setState({ ...this.state, directionFilter });
  }

  private setGrouping(grouping: Grouping) {
    this.setState({ ...this.state, grouping });
  }

  /**
   * Renders an entry per neighbour
   */
  private renderNeighborsGroupedByObject(
    neighbors: IterableIterator<NeighborEntry>,
    edgeGetter: (target: string) => string[]
  ) {
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
              this.handleSelectionChange
            )}
          </span>
          {edgeGetter(entry.neighbor).map((relationPredicate) => (
            <DetailEntry
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
  ) {
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
        <div className="mb-4">
          <span className="font-bold">
            {getObjectLabelFromGraph(relationship)} ({objects.length})
          </span>
          <div className="flex flex-wrap">
            {objects.map(({ neighbor, attributes }) => (
              <div className="mr-4">
                {renderClickableObjectLabel(
                  neighbor,
                  attributes,
                  this.handleSelectionChange
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

  public override render() {
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
