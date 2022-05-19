import { useEffect, useState } from 'react';

import dataOrig from '../../../../../libs/graph/data-source/src/lib/sample01.graph.json';

import Graph from 'graphology';
import random from 'graphology-layout/random';
import { Attributes } from 'graphology-types';

import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma,
  ZoomControl,
} from '@react-sigma/core';

import { animateNodes } from 'sigma/utils/animate';

import { useLayoutCircular } from '@react-sigma/layout-circular';
import { useLayoutRandom } from '@react-sigma/layout-random';
import {
  useLayoutForceAtlas2,
  LayoutForceAtlas2Control,
} from '@react-sigma/layout-forceatlas2';

const data = JSON.parse(JSON.stringify(dataOrig));

const LoadGraph = ({setGraphLoaded}: {setGraphLoaded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.import(data);
    random.assign(graph);

    loadGraph(graph);
  }, [loadGraph]);

  setGraphLoaded(true)
  return null;
};

const RegEvents = () => {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [nodeChanged, setNodeChanged] = useState<string | null>(null);
  const setSettings = useSetSettings();

  useEffect(() => {
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => setClickedNode(event.node),
      clickStage: () => setClickedNode(null),
    });
  }, [registerEvents]);

  useEffect(() => {
    setNodeChanged(hoveredNode ? hoveredNode : clickedNode);
  }, [hoveredNode, clickedNode]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData: Attributes = {
          ...data,
          highlighted: data['highlighted'] || false,
        };

        if (nodeChanged) {
          if (
            node === nodeChanged ||
            graph.neighbors(nodeChanged).includes(node)
          ) {
            newData['highlighted'] = true;
          } else {
            newData['color'] = '#E2E2E2';
            newData['highlighted'] = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const newData: Attributes = { ...data, hidden: false };

        if (nodeChanged && !graph.extremities(edge).includes(nodeChanged)) {
          newData['hidden'] = true;
        }
        return newData;
      },
    });
  }, [nodeChanged, setSettings, sigma]);

  return null;
};

const FormatGraph = ({ layout }: { layout: number }) => {
  const sigma = useSigma();
  const layouts = [
    useLayoutRandom(),
    useLayoutCircular(),
    useLayoutForceAtlas2({ iterations: 100 }),
  ];
  const { positions, assign } = layouts[layout];

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  useEffect(() => {
    assign();
  }, [assign, sigma]);

  return null;
};

const TestGraph = ({ layout }: { layout: number }) => {
  const [graphLoaded, setGraphLoaded] = useState(false)

  return (
    <SigmaContainer>
      <LoadGraph setGraphLoaded={setGraphLoaded}/>
      {graphLoaded ? <FormatGraph layout={layout} /> : ""}
      <RegEvents />
      <ControlsContainer position="bottom-right">
        <FullScreenControl />
        {layout === 2 ? <LayoutForceAtlas2Control /> : ''}
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
