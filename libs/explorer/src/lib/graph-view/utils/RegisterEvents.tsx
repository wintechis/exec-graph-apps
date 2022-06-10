import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';
export interface NodeProps {
  changeState: (param: {
    hoveredNode?: string | null;
    clickedNode?: string | null;
    nodeDown?: string | null;
  }) => void;
}

function RegisterEvents(props: NodeProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  // const mouseCaptor = sigma.getMouseCaptor();

  const idHover = document.getElementById('ID-hover');
  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [nodeDown, setNodeDown] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => {
        props.changeState({ hoveredNode: event.node });
        setHoveredNode(event.node);
      },
      leaveNode: () => {
        props.changeState({ hoveredNode: null });
        setHoveredNode(null);
      },
      clickNode: (event) => {
        props.changeState({ clickedNode: event.node });
        setClickedNode(event.node);
      },
      clickStage: () => {
        props.changeState({ clickedNode: null });
        setClickedNode(null);
      },
      downNode: (event) => {
        props.changeState({ nodeDown: event.node });
        setNodeDown(event.node);
      },
      mouseup: () => {
        props.changeState({ nodeDown: null });
        setNodeDown(null);
      },
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
    const relevantNode = clickedNode
      ? clickedNode
      : hoveredNode
      ? hoveredNode
      : null;

    setSettings({
      nodeReducer: (node, data) => {
        type NewType = Attributes;

        const newData: NewType = {
          ...data,
          highlighted: data['highlighted'] || false,
        };

        if (relevantNode) {
          if (
            node === relevantNode ||
            graph.neighbors(relevantNode).includes(node)
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
        const newData: Attributes = { ...data, hidden: false };

        if (relevantNode && !graph.extremities(edge).includes(relevantNode)) {
          newData['hidden'] = true;
        }
        return newData;
      },
      enableEdgeWheelEvents: false,
    });
  }, [graph, clickedNode, hoveredNode, setSettings]);

  return (
    <div
      id="ID-hover"
      style={
        hoveredNode
          ? {
              position: 'absolute',
              left: xCoord + 'px',
              top: yCoord - (idHover ? idHover.clientHeight : 0) + 'px',
              pointerEvents: 'none',
            }
          : { display: 'none' }
      }
      className="bg-gray-300 rounded-lg py-1 px-1 mb-4 text-base text-gray-800 mb-3"
    >
      {hoveredNode
        ? graph
            .getNodeAttribute(
              hoveredNode,
              'http://www.w3.org/2000/01/rdf-schema#label'
            )
            ?.replaceAll('"', '') || hoveredNode
        : ''}
    </div>
  );
}

export default RegisterEvents;
