import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

const NODE_FADE_COLOR = '#eee';

export function EventsController() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      wheel: (event) => {
        event.preventSigmaDefault();
        event.sigmaDefaultPrevented = true;
      },
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });

    const container = document
      .getElementsByClassName('sigma-mouse')
      .item(0) as HTMLElement;
    container?.addEventListener('wheel', (ev) => {
      window.scroll({
        behavior: 'auto',
        top: window.scrollY + ev.deltaY,
      });
    });

  }, [registerEvents]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, attributes) => {
        type NewType = Attributes;

        const newAttr: NewType = {
          ...attributes,
          highlighted: attributes['highlighted'] || false,
        };

        if (hoveredNode) {
          if (
            node === hoveredNode ||
            graph.neighbors(hoveredNode).includes(node)
          ) {
            if (node === hoveredNode) newAttr['highlighted'] = true;
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

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newAttr['hidden'] = true;
        }
        return newAttr;
      },
      enableEdgeWheelEvents: false,
    });
  }, [graph, hoveredNode, setSettings]);

  return null;
}
