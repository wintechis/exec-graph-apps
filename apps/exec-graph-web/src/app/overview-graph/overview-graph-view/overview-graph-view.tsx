import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import React, { memo } from 'react';
import { drawLabel } from 'libs/explorer/src/lib/graph-view/utils/layoutController';
import { OverviewAppearance } from './utils/overviewLayoutController';
import { EventsController } from './utils/overviewEventsController';

interface OverviewGraphViewProps {
  data: DataSet;
}

function OverviewGraphView(props: OverviewGraphViewProps) {
  return (
    <SigmaContainer
      graph={props.data.graph}
      initialSettings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        labelRenderer: drawLabel,
        labelDensity: 0.07,
        labelGridCellSize: 60,
        labelRenderedSizeThreshold: 20,
        defaultNodeType: 'image',
        defaultNodeColor: 'white',
      }}
      style={{ height: '500px', backgroundColor: "#F3F4F6" }}
    >
      <OverviewAppearance />
      <EventsController />
    </SigmaContainer>
  );
}

export const MemoizedOverviewGraph = memo(OverviewGraphView);
