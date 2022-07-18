import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import { EventsController } from './utils/events-controller';
import { memo, useRef } from 'react';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import {
  GraphLayoutEngine,
  MemorizedGraphLayoutEngine,
} from './utils/graph-layout-engine';
import { MemorizedControls } from './utils/controls';

import '@react-sigma/core/lib/react-sigma.min.css';
import './graph-view.css';

/**
 * Type definition of mandatory and optional properties of the {@link GraphView} component
 */
export interface GraphViewProps {
  /**
   * Denotes if the graph view should disable certain interactions, like mouse wheel zoom.
   */
  decreasedInteractivity?: boolean;
  /** Valid CSS height string, default is 50vh */
  height?: string;
  /**
   * Page specific control elements to be displayed over the graph
   */
  pageSpecificControls?: JSX.Element | null;
  /**
   * The data to visualise
   */
  data: DataSet;
  /**
   * The URI of the currently selected object
   */
  selectedObject?: string | null;
  /**
   * Invoked when a selection change occured within the graph view
   */
  onSelectionChange?: (clickedNode: string | null) => void;
  /**
   * Invoked once the graph started displaying the data
   */
  onLoaded?: () => void;
}

/**
 * View component to display the graph on the website.
 *
 * Responsible to create the SigmaContainer with all its components in which the graph will render.
 *
 * @category React Component
 */
export function GraphView(props: GraphViewProps): JSX.Element {
  // ref to get access to the GraphLayoutEngine function resetLayout in the controls component
  type GraphLayoutEngineHandle = React.ElementRef<typeof GraphLayoutEngine>;
  const graphLayoutEngineRef = useRef<GraphLayoutEngineHandle>(null);

  /**
   * Contains the SigmaContainer and its components.
   * Additionally, initial setting for the SigmaContainer are set here.
   * @returns SigmaContainer
   */
  return (
    <SigmaContainer
      graph={props.data.graph}
      initialSettings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        renderLabels: false,
        defaultNodeType: 'image',
        defaultNodeColor: 'white',
        allowInvalidContainer: true,
      }}
      style={{ height: props.height || '50vh' }}
      className="graph"
    >
      <MemorizedGraphLayoutEngine ref={graphLayoutEngineRef} />
      <MemorizedControls
        resetLayout={() => graphLayoutEngineRef.current?.resetLayout()}
        decreasedInteractivity={props.decreasedInteractivity}
        onSelectionChange={props.onSelectionChange}
        pageSpecificControls={props.pageSpecificControls}
      />
      <EventsController
        decreasedInteractivity={props.decreasedInteractivity}
        onSelectionChange={props.onSelectionChange}
        selectedNode={props.selectedObject}
        onLoaded={props.onLoaded}
      />
    </SigmaContainer>
  );
}

export const MemoizedGraphView = memo(GraphView);
