import { useEffect } from 'react';
import { useCamera, useSigma } from '@react-sigma/core';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import Graph from 'graphology';
import { Attributes } from 'graphology-types';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import random from 'graphology-layout/random';
import { animateNodes } from 'sigma/utils/animate';
import { NodeDisplayData, PartialButFor } from 'sigma/types';
import { Settings } from 'sigma/settings';
import { icons } from '../icons/icons';

export function OverviewAppearance() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const animationDuration = 1500;
  const { reset } = useCamera({ duration: animationDuration, factor: 1.5 });
  const settings = forceAtlas2.inferSettings(graph);
  const { positions } = useLayoutForceAtlas2({
    iterations: 30,
    settings: settings,
  });

  useEffect(() => {
    animateNodes(graph, positions(), { duration: animationDuration });
    reset();
  });

  return null;
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

  graph.forEachEdge((key: string, attributes: Attributes) => {
    const source = graph.source(key);
    const color = graph.getNodeAttribute(source, 'color');
    graph.setEdgeAttribute(key, 'color', color);
  });

  return graph;
}

export function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  settings: Settings
): void {
  if (!data.label || data.color === '#eee') return;

  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.font = `${weight} ${size}px ${font}`;
  const width = context.measureText(data.label).width + 8;

  context.fillStyle = '#ffffffcc';
  context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 20);

  context.fillStyle = '#000';
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
