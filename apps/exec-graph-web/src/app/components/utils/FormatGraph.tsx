import { useSigma } from '@react-sigma/core';
import { useLayoutCircular } from '@react-sigma/layout-circular';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { useLayoutRandom } from '@react-sigma/layout-random';
import { useEffect } from 'react';
import { animateNodes } from 'sigma/utils/animate';

function FormatGraph({ layout }: { layout: number }) {
  const sigma = useSigma();
  const layouts = [
    useLayoutRandom(),
    useLayoutCircular(),
    useLayoutForceAtlas2({ iterations: 100 }),
  ];
  const { positions, assign } = layouts[layout];

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  useEffect(() => {
    assign();
  }, [assign, sigma]);

  return null;
}

export default FormatGraph;
