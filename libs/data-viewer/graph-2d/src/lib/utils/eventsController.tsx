import {
  useCamera,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

const NODE_FADE_COLOR = '#bbb';

export interface EventControllerProps {
  explorer: boolean;
  setSelectedObject?: (clickedNode: string | null) => void;
  selectedObjectChangeFromOthers?: string | null;
  setStateLoaded?: () => void;
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
    if (!props.explorer) return;
    if (!props.setSelectedObject) return;

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
    if (props.explorer) {
      registerEvents({
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null),
        clickNode: (event) => {
          if (props.setSelectedObject) {
            props.setSelectedObject(event.node);
            setClickedNode(event.node);
          }
        },
        clickStage: () => {
          if (props.setSelectedObject) {
            graph.forEachNode((key, attributes) => {
              attributes['highlighted'] = false;
            });
            props.setSelectedObject(null);
            setClickedNode(null);
          }
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
    } else {
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
    }
  }, [graph, nodeDown, props, registerEvents]);

  useEffect(() => {
    if (props.explorer)
      sigma.addListener('afterRender', () => {
        if (props.setStateLoaded) props.setStateLoaded();
      });
  }, [props, sigma]);

  useEffect(() => {
    if (props.explorer && nodeDown) {
      const coords = {
        x: xCoord,
        y: yCoord,
      };
      const viewportCoords = sigma.viewportToGraph(coords);
      graph.setNodeAttribute(nodeDown, 'x', viewportCoords.x);
      graph.setNodeAttribute(nodeDown, 'y', viewportCoords.y);
    }
  }, [graph, nodeDown, props.explorer, sigma, xCoord, yCoord]);

  useEffect(() => {
    reset();
  }, [reset]);

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
