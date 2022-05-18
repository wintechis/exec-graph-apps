import { useEffect } from 'react';

import data from '../../../../../libs/graph/data-source/src/lib/sample01.graph.json';

import Graph from 'graphology';
import random from 'graphology-layout/random';

import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  useSigma,
  ZoomControl,
} from '@react-sigma/core';


import { animateNodes } from 'sigma/utils/animate';

import { useLayoutCircular } from '@react-sigma/layout-circular';

import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';

const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    const dataToMap = JSON.parse(JSON.stringify(data));
    graph.import(dataToMap);
    random.assign(graph);
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const FormatGraphIter = () => {
  const sigma = useSigma();
  const { positions, assign } = useLayoutForceAtlas2({ iterations: 100 });

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  useEffect(() => {
    assign();
  }, [assign, sigma]);

  return null;
};

const FormatGraph = () => {
  const sigma = useSigma();
  const { positions, assign } = useLayoutCircular();

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  useEffect(() => {
    assign();
  }, [assign, sigma]);

  return null;
};

export const TestGraph = ({
  layoutIterative,
}: {
  layoutIterative: boolean;
}) => {

  

  return (
    <SigmaContainer>
      <LoadGraph />
      {layoutIterative ? <FormatGraphIter /> : <FormatGraph />}
      <ControlsContainer position="bottom-right">
        <FullScreenControl />
        {layoutIterative ? <LayoutForceAtlas2Control /> : ''}
      </ControlsContainer>
      <ControlsContainer position="top-right">
        <SearchControl />
      </ControlsContainer>
      <ControlsContainer position="top-left">
        <ZoomControl />
      </ControlsContainer>
      
    </SigmaContainer>
  );
};

export default TestGraph;
