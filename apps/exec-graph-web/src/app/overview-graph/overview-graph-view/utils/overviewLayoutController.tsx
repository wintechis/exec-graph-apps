import { useEffect } from 'react';
import { useCamera, useSigma } from '@react-sigma/core';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import Graph from 'graphology';
import { Attributes } from 'graphology-types';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import random from 'graphology-layout/random';
import { animateNodes } from 'sigma/utils/animate';
import { icons } from '../icons/icons';
import Controls from './overviewControlsController';

export function OverviewAppearance() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const animationDuration = 1500;
  const { reset } = useCamera({ duration: animationDuration, factor: 1.5 });
  const settings = forceAtlas2.inferSettings(graph);
  const { positions } = useLayoutForceAtlas2({
    iterations: 150,
    settings: settings,
  });

  function setLayout() {
    animateNodes(graph, positions(), { duration: animationDuration });
    reset();
  }

  useEffect(() => {
    setLayout();
  });

  return <Controls setLayout={setLayout}></Controls>;
}

export function SetLayout(
  graph: Graph<Attributes, Attributes, Attributes>
): Graph<Attributes, Attributes, Attributes> {
  random.assign(graph);

  graph.forEachNode((key: string, attributes: Attributes) => {
    const label = attributes['http://www.w3.org/2000/01/rdf-schema#label'];
    if (label) graph.setNodeAttribute(key, 'label', label.replaceAll('"', ''));
    else graph.setNodeAttribute(key, 'label', key);

    const fullType =
      attributes['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'];
    let type: string | undefined = '';

    if (Array.isArray(fullType)) {
      const types = fullType.map((type) => {
        const strType = `${type}`;
        const splitType = strType.split('/');
        return splitType.pop();
      });
      type = types.find((type) => type && type in icons.nodes);
    } else {
      const strType = `${fullType}`;
      const splitType = strType.split('/');
      type = splitType.pop();
      if (!type || !(type in icons.nodes)) type = undefined;
    }

    if (!type) type = 'QuestionMark';

    const iconNodeAttributes = icons.nodes[type as keyof typeof icons.nodes];

    graph.setNodeAttribute(key, 'image', iconNodeAttributes.image);
    graph.setNodeAttribute(key, 'color', iconNodeAttributes.color);
    graph.setNodeAttribute(key, 'nodeType', type);

    graph.setNodeAttribute(key, 'score', graph.neighbors(key).length);
  });

  const scores = graph
    .nodes()
    .map((node) => graph.getNodeAttribute(node, 'score'));
  const minDegree = Math.min(...scores);
  const maxDegree = Math.max(...scores);
  const MIN_NODE_SIZE = 3;
  const MAX_NODE_SIZE = 15;
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

  graph.forEachEdge((key: string, attributes: Attributes) => {
    const fullPred = `${attributes['predicate']}`;
    const pred = fullPred.split('/').pop()?.split('#').pop();

    const color = icons.edges[pred as keyof typeof icons.edges];
    graph.setEdgeAttribute(key, 'color', color);
  });

  return graph;
}
