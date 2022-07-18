import {
  useCamera,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from '@react-sigma/core';
import { Attributes } from 'graphology-types';
import { useEffect, useState } from 'react';

/**
 * Type definition of optional properties of the {@link EventsController} component
 */
export interface EventControllerProps {
  /**
   * property to determine whether the graph is with decreased interactivity (e.g. graph on overview page)
   */
  decreasedInteractivity?: boolean;
  /**
   * property to store the currently selected node
   */
  selectedNode?: string | null;
  /**
   * method to be called when the component records a change of the selected node
   */
  onSelectionChange?: (clickedNode: string | null) => void;
  /**
   * method to trigger when graph is loaded
   */
  onLoaded?: () => void;
}

/**
 * Component to control the events on the graph.
 *
 * @category React Component
 */
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

  // when the selection was set from the outside, propagate it to the graph
  const selectedNode = props.selectedNode;
  useEffect(() => {
    if (selectedNode && graph.hasNode(selectedNode)) {
      setClickedNode(selectedNode);
    } else {
      setClickedNode(null);
    }
    reset();
  }, [graph, selectedNode, reset]);

  const { decreasedInteractivity, onSelectionChange } = props;
  useEffect(() => {
    if (decreasedInteractivity) {
      // in decreased intractivity mode, we don't mouse wheel
      // zooming and only hovering interaction with nodes
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
      return;
    }
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => {
        if (onSelectionChange) {
          onSelectionChange(event.node);
        }
        setClickedNode(event.node);
      },
      clickStage: () => {
        graph.forEachNode((_key, attributes) => {
          attributes['highlighted'] = false;
        });
        setClickedNode(null);
        if (onSelectionChange) {
          onSelectionChange(null);
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
  }, [
    graph,
    nodeDown,
    onSelectionChange,
    decreasedInteractivity,
    registerEvents,
  ]);

  // propagate onLoaded event
  const onLoadedCallback = props.onLoaded;
  useEffect(() => {
    if (onLoadedCallback) {
      sigma.addListener('afterRender', onLoadedCallback);
      // to ensure we always have only callback active, remove the old one before calling the effect again:
      const oldCallback = onLoadedCallback;
      return () => {
        sigma.removeListener('afterRender', oldCallback);
      };
    }
    return;
  }, [onLoadedCallback, sigma]);

  useEffect(() => {
    if (!props.decreasedInteractivity && nodeDown) {
      const coords = {
        x: xCoord,
        y: yCoord,
      };
      const viewportCoords = sigma.viewportToGraph(coords);
      graph.setNodeAttribute(nodeDown, 'x', viewportCoords.x);
      graph.setNodeAttribute(nodeDown, 'y', viewportCoords.y);
    }
  }, [graph, nodeDown, props.decreasedInteractivity, sigma, xCoord, yCoord]);

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
          } else newAttr['hidden'] = true;
        }
        return newAttr;
      },
      edgeReducer: (edge, attributes) => {
        const newAttr: Attributes = { ...attributes, hidden: false };

        if (
          relevantNode &&
          graph.hasEdge(edge) &&
          !graph.extremities(edge).includes(relevantNode)
        ) {
          newAttr['hidden'] = true;
        }
        return newAttr;
      },
      enableEdgeWheelEvents: false,
    });
  }, [graph, clickedNode, hoveredNode, setSettings]);

  /**
   * @returns null
   */
  return null;
}
