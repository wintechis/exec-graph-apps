import { memo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useCamera, useSigma } from '@react-sigma/core';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { animateNodes } from 'sigma/utils/animate';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GraphLayoutEngineProps {}

export interface GraphLayoutEngineHandle {
  resetLayout: () => void;
}

export const GraphLayoutEngine = forwardRef<
  GraphLayoutEngineHandle,
  GraphLayoutEngineProps
>((_props, ref) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const animationDuration = 1500;
  const { reset } = useCamera({ duration: animationDuration, factor: 1.5 });
  const settings = forceAtlas2.inferSettings(graph);
  const { positions } = useLayoutForceAtlas2({
    iterations: 50,
    settings: settings,
  });

  function setLayout() {
    animateNodes(graph, positions(), { duration: animationDuration });
    reset();
  }

  useImperativeHandle(ref, () => ({
    resetLayout() {
      setLayout();
    },
  }));

  // set the layout once, when initiating the graph
  useEffect(() => {
    setLayout();
  });

  return null;
});

export const MemorizedGraphLayoutEngine = memo(GraphLayoutEngine);
