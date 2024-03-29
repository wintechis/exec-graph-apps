import { readFileSync, writeFileSync } from 'fs';
import { DirectedGraph, MultiDirectedGraph } from 'graphology';
import { areSameGraphs, haveSameNodesDeep } from 'graphology-assertions';
import path = require('path');
import { RdfDataSource } from './rdf-data-source';
import { DEFAULT_SCHEMA } from './schema';

describe('RdfDataSource', () => {
  it('can process Tom and Jerry RDF', async () => {
    const ds = new RdfDataSource(
      `PREFIX c: <http://example.org/cartoons#>
    c:Tom a c:Cat.
    c:Jerry a c:Mouse;
            c:smarterThan c:Tom.`,
      DEFAULT_SCHEMA
    );
    const { graph } = await ds.getAll();
    expect(graph?.order).toEqual(2);
  });

  it('can process sample01 file', async () => {
    const rdf = readFileSync(
      path.join(__dirname, 'test-sources/sample01.n3')
    ).toString();
    const dataSource = new RdfDataSource(rdf, DEFAULT_SCHEMA, {
      format: 'text/n3',
    });
    const { graph } = await dataSource.getAll();
    expect(graph).toBeTruthy();
    if (!graph) {
      return;
    }

    const target = JSON.parse(
      readFileSync(
        path.join(__dirname, 'test-sources/sample01.graph.json')
      ).toString()
    );
    const targetGraph = new DirectedGraph().import(target);

    expect(areSameGraphs(targetGraph, graph));
    expect(haveSameNodesDeep(targetGraph, graph));
    // There is no deep comparison of edges, since the auto
    // generated keys are random and can't be seeded
  });

  it('can process person file', async () => {
    const rdf = readFileSync(
      path.join(__dirname, 'test-sources/person.ttl')
    ).toString();
    const dataSource = new RdfDataSource(rdf, DEFAULT_SCHEMA);
    const { graph } = await dataSource.getAll();
    expect(graph).toBeTruthy();
    if (!graph) {
      return;
    }

    const target = JSON.parse(
      readFileSync(
        path.join(__dirname, 'test-sources/person.graph.json')
      ).toString()
    );
    const targetGraph = new MultiDirectedGraph().import(target);
    expect(areSameGraphs(targetGraph, graph));
    /*writeFileSync(
      path.join(__dirname, 'test-sources/person.graph.json'),
      JSON.stringify(dataset.graph.export())
    );*/
  });
});
