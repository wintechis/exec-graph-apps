import { useCamera, useSigma } from '@react-sigma/core';
import { useLayoutCirclepack } from '@react-sigma/layout-circlepack';
// import { useLayoutRandom } from '@react-sigma/layout-random';

import { memo, useEffect } from 'react';
import { animateNodes } from 'sigma/utils/animate';
import { MemorizedControls } from './controlsController';
import random from 'graphology-layout/random';

import { icons } from '../icons/icons';

import Graph from 'graphology';
import { Attributes } from 'graphology-types';

export interface AppearanceProps {
  handleSelectionChangeFromOthers: (uri: string | null) => void;
}

function Appearance(props: AppearanceProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const animationDuration = 1500;

  const { reset } = useCamera({ duration: animationDuration, factor: 1.5 });
  const { positions } = useLayoutCirclepack();

  function setLayout() {
    animateNodes(graph, positions(), { duration: animationDuration });
    reset();
  }

  useEffect(() => {
    setLayout();
  });

  return (
    <MemorizedControls
      resetLayout={setLayout}
      handleSelectionChangeFromOthers={props.handleSelectionChangeFromOthers}
    />
  );
}

export const MemorizedAppearance = memo(Appearance);

export function SetLayout(
  graph: Graph<Attributes, Attributes, Attributes>
): Graph<Attributes, Attributes, Attributes> {
  random.assign(graph);

  graph.forEachNode((key: string, attributes: Attributes) => {
    const label = attributes['http://www.w3.org/2000/01/rdf-schema#label'];
    if (label) graph.setNodeAttribute(key, 'label', label.replaceAll('"', ''));
    else graph.setNodeAttribute(key, 'label', key);

    graph.setNodeAttribute(key, 'score', graph.neighbors(key).length);

    const fullType = attributes['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'];
    let type: string | undefined = '';

    if (Array.isArray(fullType)) {
      const types = fullType.map((type) => {
        const strType = `${type}`;
        const splitType = strType.split('/');
        return splitType.pop();
      });
      type = types.find((type) => type && type in icons);
    } else {
      const strType = `${fullType}`;
      const splitType = strType.split('/');
      type = splitType.pop();
      if(!type || !(type in icons))
        type = undefined;
    }
    
    let image = ""
    if (type) image = icons[type as keyof typeof icons];
    else image = icons.QuestionMark

    graph.setNodeAttribute(key, 'image', image);
  });

  const scores = graph
    .nodes()
    .map((node) => graph.getNodeAttribute(node, 'score'));
  const minDegree = Math.min(...scores);
  const maxDegree = Math.max(...scores);
  const MIN_NODE_SIZE = 3;
  const MAX_NODE_SIZE = 30;
  graph.forEachNode((node) =>
    graph.setNodeAttribute(
      node,
      'size',
      ((graph.getNodeAttribute(node, 'score') - minDegree) /
        (maxDegree - minDegree)) *
        (MAX_NODE_SIZE - MIN_NODE_SIZE) +
        MIN_NODE_SIZE
    )
  );

  return graph;
}
