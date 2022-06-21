import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import { EventsController } from './utils/eventsController';
import { memo } from 'react';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { MemorizedAppearance } from './utils/layoutController';


export interface GraphViewProps {
  data: DataSet;
  setSelectedObject: (clickedNode: string | null) => void;
  selectedObjectChangeFromDetails?: string | null;
  handleSelectionChangeFromOthers: (uri: string | null) => void;
}

function GraphView(props: GraphViewProps) {
  return (
    <SigmaContainer
      graph={props.data.graph}
      initialSettings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        renderLabels: true,
        // labelGridCellSize: 60,
        labelRenderedSizeThreshold: 15,
        defaultNodeType: 'image',
        defaultNodeColor: 'white'
      }}
      style={{ height: '800px' }}
    >
      <MemorizedAppearance
        handleSelectionChangeFromOthers={props.handleSelectionChangeFromOthers}
      />
      <EventsController
        setSelectedObject={props.setSelectedObject}
        selectedObjectChangeFromDetails={props.selectedObjectChangeFromDetails}
      />
    </SigmaContainer>
  );
}

export const MemoizedGraphView = memo(GraphView);