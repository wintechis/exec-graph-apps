import '@react-sigma/core/lib/react-sigma.min.css';

import { DataSet } from '@exec-graph/graph/types';
import { SigmaContainer } from '@react-sigma/core';
import random from 'graphology-layout/random';
// import circlepack from 'graphology-layout/circlepack';

import RegisterEvents from './utils/RegisterEvents';
import Controls from './utils/Controls';
import FormatGraph from './utils/FormatGraph';

export interface GraphViewProps {
  data: DataSet;
}

function GraphView(props: GraphViewProps) {
  if (props.data.graph) random.assign(props.data.graph);

  return (
    <SigmaContainer graph={props.data.graph} style={{ height: '800px' }}>
      <FormatGraph />
      <RegisterEvents />
      <Controls />
    </SigmaContainer>
  );
}

export default GraphView;
