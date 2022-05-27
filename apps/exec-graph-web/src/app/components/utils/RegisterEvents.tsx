import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

function RegisterEvents() {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [nodeChanged, setNodeChanged] = useState<string | null>(null);
  const setSettings = useSetSettings();

  const idHover = document.getElementById('ID-hover');
  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);

  document.addEventListener('mousemove', (e) => {
    setXCoord(e.offsetX);
    setYCoord(e.offsetY);
  });

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
        type NewType = Attributes;

        const newData: NewType = {
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
      enableEdgeWheelEvents: false,
    });
  }, [nodeChanged, setSettings, sigma]);

  return (
    <div
      id="ID-hover"
      style={
        hoveredNode
          ? {
              position: 'absolute',
              left: xCoord + 'px',
              top: yCoord - (idHover ? idHover.clientHeight : 0) + 'px',
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
