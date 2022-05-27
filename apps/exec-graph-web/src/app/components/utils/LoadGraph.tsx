import { useLoadGraph } from '@react-sigma/core';
import Graph from 'graphology';
import random from 'graphology-layout/random';
import { useEffect } from 'react'
import dataOrig from '../../../../../../libs/graph/data-source/src/lib/sample01.graph.json';

function LoadGraph({setGraphLoaded}: {setGraphLoaded: React.Dispatch<React.SetStateAction<boolean>>}) {
    const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    const data = JSON.parse(JSON.stringify(dataOrig));
    graph.import(data);
    random.assign(graph);

    loadGraph(graph);
  }, [loadGraph]);

  setGraphLoaded(true)
  return null;
}

export default LoadGraph