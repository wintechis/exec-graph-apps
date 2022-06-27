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
  const [clickedNode, setClickedNode] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      wheel: (event) => {
        event.preventSigmaDefault();
        event.sigmaDefaultPrevented = true;
      },
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => {
        setClickedNode(event.node);
      },
      clickStage: () => {
        setClickedNode(null);
      },
    });

    const container = document
      .getElementsByClassName('sigma-mouse')
      .item(0) as HTMLElement;
    // console.log(container);
    container?.addEventListener('wheel', (ev) => {
      window.scroll({
        behavior: 'auto',
        top: window.scrollY + ev.deltaY,
      });
    });

    // sigma.addListener('afterRender', () => setScrollEvent());
  }, [registerEvents]);

  useEffect(() => {
    const relevantNode = clickedNode
      ? clickedNode
      : hoveredNode
      ? hoveredNode
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
