import { Dispatch, SetStateAction } from 'react';

import RegisterEvents from './utils/RegisterEvents';

import { SigmaContainer } from '@react-sigma/core';

import LoadGraph from './utils/LoadGraph';
import FormatGraph from './utils/FormatGraph';
import Controls from './utils/Controls';

const TestGraph = ({
  layout,
  graphLoaded,
  setGraphLoaded,
}: {
  layout: number;
  graphLoaded: boolean;
  setGraphLoaded: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <SigmaContainer>
      {graphLoaded ? '' : <LoadGraph setGraphLoaded={setGraphLoaded} />}
      {graphLoaded ? <FormatGraph layout={layout} /> : ''}
      <RegisterEvents />
      <Controls layout={layout} />
    </SigmaContainer>
  );
};

export default TestGraph;
