import { useCamera, useSigma } from '@react-sigma/core';
import { useLayoutCirclepack } from '@react-sigma/layout-circlepack';
import { useEffect } from 'react';
import { animateNodes } from 'sigma/utils/animate';

function FormatGraph() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const animationDuration = 1000;

  const { reset } = useCamera({ duration: animationDuration, factor: 1.5 });
  const { positions } = useLayoutCirclepack();

  useEffect(() => {
    setLayout();
  });

  function setLayout() {
    animateNodes(graph, positions(), { duration: animationDuration });
    reset();
  }

  return (
    <div
      className="react-sigma-control"
      style={{ position: 'absolute', left: '10px', bottom: '10px' }}
    >
      <button onClick={() => setLayout()} title="Reset Layout">
        X
      </button>
    </div>
  );
}

export default FormatGraph;
