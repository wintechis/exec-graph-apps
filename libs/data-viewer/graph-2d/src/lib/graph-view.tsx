import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import { EventsController } from './utils/eventsController';
import { memo } from 'react';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { MemorizedAppearance } from './utils/layoutController';

import './graph-view.css';

export interface GraphViewProps {
  explorer: boolean;
  data: DataSet;
  setSelectedObject?: (clickedNode: string | null) => void;
  selectedObjectChangeFromOthers?: string | null;
  handleSelectionChangeFromOthers?: (uri: string | null) => void;
  setStateLoaded?: () => void;
  handleScrollButtonClick?: () => void;
}

function GraphView(props: GraphViewProps) {
  const styleHeight = props.explorer ? '80vh' : '50vh';

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
      style={{ height: styleHeight }}
      className="graph"
    >
      <MemorizedAppearance
        explorer={props.explorer}
        handleSelectionChangeFromOthers={props.handleSelectionChangeFromOthers}
        handleScrollButtonClick={props.handleScrollButtonClick}
      />
      <EventsController
        explorer={props.explorer}
        setSelectedObject={props.setSelectedObject}
        selectedObjectChangeFromOthers={props.selectedObjectChangeFromOthers}
        setStateLoaded={props.setStateLoaded}
      />
    </SigmaContainer>
  );
}

export const MemoizedGraphView = memo(GraphView);
