import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import React, { memo } from 'react';
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
        renderLabels: false,
        defaultNodeType: 'image',
        defaultNodeColor: 'white',
      }}
      style={{ height: '50vh', backgroundColor: '#F3F4F6' }}
    >
      <OverviewAppearance />
      <EventsController />
    </SigmaContainer>
  );
}

export const MemoizedOverviewGraph = memo(OverviewGraphView);
