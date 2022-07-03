import {
  useCamera,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

const NODE_FADE_COLOR = '#bbb';
// const EDGE_FADE_COLOR = "#eee";

export interface EventControllerProps {
  setSelectedObject: (clickedNode: string | null) => void;
  selectedObjectChangeFromOthers?: string | null;
  setStateLoaded: () => void;
}

export function EventsController(props: EventControllerProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const { reset } = useCamera({ duration: 1500, factor: 1.5 });

  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [nodeDown, setNodeDown] = useState<string | null>(null);

  useEffect(() => {
    if (
      props.selectedObjectChangeFromOthers &&
      graph.hasNode(props.selectedObjectChangeFromOthers)
    ) {
      props.setSelectedObject(props.selectedObjectChangeFromOthers);
      setClickedNode(props.selectedObjectChangeFromOthers);
    } else {
      props.setSelectedObject(null);
      setClickedNode(null);
    }

    reset();
  }, [graph, props, reset]);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => {
        props.setSelectedObject(event.node);
        setClickedNode(event.node);
      },
      clickStage: () => {
        graph.forEachNode((key, attributes) => {
          attributes['highlighted'] = false;
        });
        props.setSelectedObject(null);
        setClickedNode(null);
      },
      downNode: (event) => setNodeDown(event.node),
      mouseup: () => setNodeDown(null),
      mousemove: (event) => {
        setXCoord(event.x);
        setYCoord(event.y);

        if (nodeDown) {
          event.preventSigmaDefault();
          event.original.preventDefault();
          event.original.stopPropagation();
        } else {
          event.sigmaDefaultPrevented = false;
        }
      },
    });
  }, [graph, nodeDown, props, registerEvents]);

  useEffect(() => {
    sigma.addListener('afterRender', () => props.setStateLoaded());
  }, [props, sigma]);

  useEffect(() => {
    if (nodeDown) {
      const coords = {
        x: xCoord,
        y: yCoord,
      };
      const viewportCoords = sigma.viewportToGraph(coords);
      graph.setNodeAttribute(nodeDown, 'x', viewportCoords.x);
      graph.setNodeAttribute(nodeDown, 'y', viewportCoords.y);
    }
  }, [graph, nodeDown, sigma, xCoord, yCoord]);

  useEffect(() => {
    let relevantNode = clickedNode
      ? clickedNode
      : hoveredNode
      ? hoveredNode
      : null;

    relevantNode = graph.hasNode(relevantNode) ? relevantNode : null;

    setSettings({
      nodeReducer: (node, attributes) => {
        type NewType = Attributes;

        const newAttr: NewType = {
          ...attributes,
          highlighted: attributes['highlighted'] || false,
        };

        if (relevantNode) {
          if (
            node === relevantNode ||
            graph.neighbors(relevantNode).includes(node)
          ) {
            if (node === relevantNode) newAttr['highlighted'] = true;
          } else {
            newAttr['color'] = NODE_FADE_COLOR;
            newAttr['highlighted'] = false;
            newAttr['image'] = null;
          }
        }
        return newAttr;
      },
      edgeReducer: (edge, attributes) => {
        const newAttr: Attributes = { ...attributes, hidden: false };

        if (relevantNode && !graph.extremities(edge).includes(relevantNode)) {
          newAttr['hidden'] = true;
        }
        return newAttr;
      },
      enableEdgeWheelEvents: false,
    });
  }, [graph, clickedNode, hoveredNode, setSettings]);

  return null;
}