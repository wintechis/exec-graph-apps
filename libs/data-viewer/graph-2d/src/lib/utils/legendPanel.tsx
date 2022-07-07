import { useSigma } from '@react-sigma/core';
import { BsMap } from 'react-icons/bs';
import { icons } from '../icons/icons';
import Panel from './panel';

function LegendPanel() {
  const graph = useSigma().getGraph();
  const nodesInGraph = graph.getAttribute('nodeTypes') as Array<string>;
  nodesInGraph.sort((a, b) => {
    if (a === 'Others') return Number.MAX_VALUE;
    if (b === 'Others') return -Number.MAX_VALUE;

    return a.localeCompare(b);
  });
  const iconNodes = icons['nodes'];

  const edgeTypesInGraph = graph.getAttribute('edgeTypes') as Array<string>;
  edgeTypesInGraph.sort((a, b) => a.localeCompare(b));
  const iconEdges = icons['edges'];

  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsMap />
          <p>Legend</p>
        </>
      }
    >
      {/* <p>Nodes</p> */}
      <ul>
        {nodesInGraph.map((node) => {
          const key = node as keyof typeof iconNodes;

          return (
            <li key={node} style={{ lineHeight: 'auto' }}>
              <object
                data={iconNodes[key].image}
                type="image/svg+xml"
                className="w-6 h-6 mt-1"
                style={{
                  backgroundColor: iconNodes[key].color,
                  borderRadius: '50%',
                  border: "1px solid white",
                  padding: "2px",
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  marginRight: '0.5em',
                }}
              >
                Icon
              </object>
              <p style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                {iconNodes[key].label}
              </p>
            </li>
          );
        })}
      </ul>
      {/* <p style={{marginTop: "0.5em"}}>Edges</p> */}
      <ul style={{marginTop: "0.5em"}}>
        {edgeTypesInGraph.map((type) => {
          let color = '';
          for (const edge in iconEdges) {
            const key = edge as keyof typeof iconEdges;
            if (iconEdges[key].type === type) {
              color = iconEdges[key].color;
              break;
            }
          }
          return (
            <li key={type} style={{ lineHeight: 'auto' }}>
              <div className="w-6 h-6" style={{ backgroundColor: "", borderRadius: "50%", display: 'inline-block', verticalAlign: "middle", marginRight: '0.5em'}}>
                <div
                  style={{
                    borderRadius: "30%",
                    borderBottom: `2px solid ${color}`,
                    WebkitTransform: 'translateY(0.75rem) rotate(45deg)',
                  }}
                ></div>
              </div>
              <p style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                {type}
              </p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export default LegendPanel;
