import Graph from 'graphology';
import { Attributes } from 'graphology-types';
import random from 'graphology-layout/random';
import { GraphDesign } from '../assets/design';

/**
 * Sets the initial layout of the fetched data/graph from the remote point.
 * It does conditional formatting of nodes and edges and sets node coordinates to random.
 * The latter is required due to SigmaContainer demanding initial node coordinates to display the graph.
 * @category React Component
 */
export function SetLayout(
  graph: Graph<Attributes, Attributes, Attributes>
): Graph<Attributes, Attributes, Attributes> {
  // sets the x and y value of each node on the fetched graph randomly, so the SigmaContainer can display the graph initially
  random.assign(graph);

  graph.forEachNode((key: string, attributes: Attributes) => {
    // setting label attribute to the custom label attribute of the data
    // label attribute needed for sigma.js being able to display the labels when click or hover
    const label = attributes['http://www.w3.org/2000/01/rdf-schema#label'];
    if (label) graph.setNodeAttribute(key, 'label', label.replaceAll('"', ''));
    else graph.setNodeAttribute(key, 'label', key);

    // setting type attribute to the nodes to be able to format them conditionally and adress them by type
    const fullType =
      attributes['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'];
    let type: string | undefined = '';

    if (Array.isArray(fullType)) {
      const types = fullType.map((type) => {
        const strType = `${type}`;
        const splitType = strType.split('/');
        return splitType.pop();
      });
      type = types.find((type) => type && type in GraphDesign.nodes);
    } else {
      const strType = `${fullType}`;
      const splitType = strType.split('/');
      type = splitType.pop();
      if (!type || !(type in GraphDesign.nodes)) type = undefined;
    }

    if (!type) type = 'Others';

    const iconNodeAttributes =
      GraphDesign.nodes[type as keyof typeof GraphDesign.nodes];

    graph.setNodeAttribute(key, 'image', iconNodeAttributes.image);
    graph.setNodeAttribute(key, 'color', iconNodeAttributes.color);
    graph.setNodeAttribute(key, 'nodeType', type);
    graph.setNodeAttribute(key, 'score', graph.neighbors(key).length);

    if (graph.hasAttribute('nodeTypes')) {
      graph.updateAttribute('nodeTypes', (types) => {
        const typesArr = types as Array<string>;
        if (type && !typesArr.includes(type)) typesArr.push(type);

        return typesArr;
      });
    } else graph.setAttribute('nodeTypes', [type]);
  });

  // setting the node size depending on the count of edges the node has (= score)
  const scores = graph
    .nodes()
    .map((node) => graph.getNodeAttribute(node, 'score'));
  const minDegree = Math.min(...scores);
  const maxDegree = Math.max(...scores);
  const MIN_NODE_SIZE = 3;
  const MAX_NODE_SIZE = 15;
  graph.forEachNode((node) =>
    graph.setNodeAttribute(
      node,
      'size',
      ((graph.getNodeAttribute(node, 'score') - minDegree) /
        (maxDegree - minDegree)) *
        (MAX_NODE_SIZE - MIN_NODE_SIZE) +
        MIN_NODE_SIZE
    )
  );

  graph.forEachEdge((key: string, attributes: Attributes) => {
    // setting predicate attribute to the nodes to be able to format them conditionally and adress them by type
    const fullPred = `${attributes['predicate']}`;
    const pred = fullPred.split('/').pop()?.split('#').pop();

    const edgeType = GraphDesign.edges[pred as keyof typeof GraphDesign.edges];
    graph.setEdgeAttribute(key, 'color', edgeType.color);

    const type = edgeType.type;
    if (graph.hasAttribute('edgeTypes')) {
      graph.updateAttribute('edgeTypes', (types) => {
        const typesArr = types as Array<string>;
        if (type && !typesArr.includes(type)) typesArr.push(type);

        return typesArr;
      });
    } else graph.setAttribute('edgeTypes', [type]);
  });

  return graph;
}
