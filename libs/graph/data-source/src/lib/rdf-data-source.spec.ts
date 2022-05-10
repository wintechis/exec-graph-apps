import { readFileSync } from 'fs';
import { DirectedGraph } from 'graphology';
import { areSameGraphs, haveSameNodesDeep } from 'graphology-assertions';
import path = require('path');
import { RdfDataSource } from './rdf-data-source';
import { DEFAULT_SCHEMA } from './schema';

describe('RdfDataSource', () => {
  it('can process Tom and Jerry RDF', () => {
    const ds = new RdfDataSource(
      `PREFIX c: <http://example.org/cartoons#>
    c:Tom a c:Cat.
    c:Jerry a c:Mouse;
            c:smarterThan c:Tom.`,
      DEFAULT_SCHEMA
    );
    const dataset = ds.getAll();
    console.log(JSON.stringify(dataset.graph.export()));
    expect(dataset.graph.order).toEqual(2);
  });

  it('can process sample01 file', () => {
    const rdf = readFileSync(path.join(__dirname, 'sample01.n3')).toString();
    const dataSource = new RdfDataSource(rdf, DEFAULT_SCHEMA, {
      format: 'text/n3',
    });
    const dataset = dataSource.getAll();

    const target = JSON.parse(
      readFileSync(path.join(__dirname, 'sample01.graph.json')).toString()
    );
    const targetGraph = new DirectedGraph().import(target);

    expect(areSameGraphs(targetGraph, dataset.graph));
    expect(haveSameNodesDeep(targetGraph, dataset.graph));
    // There is no deep comparison of edges, since the auto
    // generated keys are random and can't be seeded
  });
});
