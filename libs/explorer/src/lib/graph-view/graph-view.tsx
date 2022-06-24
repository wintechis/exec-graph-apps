import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import { EventsController } from './utils/eventsController';
import { memo } from 'react';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { MemorizedAppearance, drawLabel } from './utils/layoutController';

import './graph-view.css';

export interface GraphViewProps {
  data: DataSet;
  setSelectedObject: (clickedNode: string | null) => void;
  selectedObjectChangeFromOthers?: string | null;
  handleSelectionChangeFromOthers: (uri: string | null) => void;
  setStateLoaded: () => void;
}

function GraphView(props: GraphViewProps) {
  return (
    <SigmaContainer
      graph={props.data.graph}
      initialSettings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        labelRenderer: drawLabel,
        // renderLabels: false,
        // labelGridCellSize: 60,
        labelDensity: 0.07,
        labelGridCellSize: 60,
        labelRenderedSizeThreshold: 20,
        defaultNodeType: 'image',
        defaultNodeColor: 'white',
      }}
      style={{ height: '80vh' }}
      className="graph"
    >
      <MemorizedAppearance
        handleSelectionChangeFromOthers={props.handleSelectionChangeFromOthers}
      />
      <EventsController
        setSelectedObject={props.setSelectedObject}
        selectedObjectChangeFromOthers={props.selectedObjectChangeFromOthers}
        setStateLoaded={props.setStateLoaded}
      />
    </SigmaContainer>
  );
}

export const MemoizedGraphView = memo(GraphView);
