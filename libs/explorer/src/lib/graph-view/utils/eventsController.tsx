import {
  useCamera,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

const NODE_FADE_COLOR = '#eee';
// const EDGE_FADE_COLOR = "#eee";

export interface EventControllerProps {
  setSelectedObject: (clickedNode: string | null) => void;
  selectedObjectChangeFromDetails?: string | null;
  parentDivId: string;
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
    if (props.selectedObjectChangeFromDetails) {
      props.setSelectedObject(props.selectedObjectChangeFromDetails);
      setClickedNode(props.selectedObjectChangeFromDetails);
      reset();
    }
  }, [props, reset]);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => {
        props.setSelectedObject(event.node);
        setClickedNode(event.node);
      },
      clickStage: () => {
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

    const parentDiv = document.getElementById(props.parentDivId);
    parentDiv?.addEventListener('click', (ev) => {
      if (ev.target !== ev.currentTarget)
        return;

      props.setSelectedObject(null);
      setClickedNode(null);
    });

  }, [nodeDown, props, registerEvents]);

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
    const relevantNode = hoveredNode
      ? hoveredNode
      : clickedNode
      ? clickedNode
      : null;

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
