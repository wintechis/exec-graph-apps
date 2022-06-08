import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

function RegisterEvents() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  // const mouseCaptor = sigma.getMouseCaptor();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [nodeDown, setNodeDown] = useState<string | null>(null);

  const idHover = document.getElementById('ID-hover');
  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => setClickedNode(event.node),
      clickStage: () => setClickedNode(null),
      downNode: (event) => setNodeDown(event.node),
      mouseup: (event) => setNodeDown(null),
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
  }, [nodeDown, registerEvents]);

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
  }, [clickedNode, graph, hoveredNode, setSettings]);

  return (
    <div
      id="ID-hover"
      style={
        hoveredNode
          ? {
              position: 'absolute',
              left: xCoord + 'px',
              top: yCoord - (idHover ? idHover.clientHeight : 0) + 'px',
              pointerEvents: "none",
            }
          : { display: 'none' }
      }
      className="bg-gray-300 rounded-lg py-1 px-1 mb-4 text-base text-gray-800 mb-3"
    >
      {hoveredNode}
    </div>
  );
}

export default RegisterEvents;
