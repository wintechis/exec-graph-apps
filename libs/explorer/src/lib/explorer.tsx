import {
  HttpClient,
  FetchHttpClient,
  HttpSparqlRepository,
  RemoteDataSource,
  HttpError,
} from '@exec-graph/graph/data-source-remote';
import { DataSet } from '@exec-graph/graph/types';
import { Component } from 'react';
import SparqlEditor from './sparql-editor/sparql-editor';
import TableView from './table-view/table-view';
import GraphView from './graph-view/graph-view';
import { AdjustmentsIcon } from '@heroicons/react/outline';

export interface ExplorerProps {
  /** URL pointing to a remote SPARQL dndpoint */
  sparqlEndpoint: string;
}

/**
 * Top-level view component to display the Explore page on the website.
 * 
 * Responsible to manage the shared state of all settings and viewer components.
 * 
 * @category React Component
 */
export class Explorer extends Component<ExplorerProps, { data?: DataSet, error?: {message: string} }> {
  private dataSource: RemoteDataSource;

  constructor(props: ExplorerProps) {
    super(props);
    this.state = {};
    const httpClient: HttpClient = new FetchHttpClient();
    const sparqlRepository = new HttpSparqlRepository(
      props.sparqlEndpoint,
      httpClient
    );
    this.dataSource = new RemoteDataSource(sparqlRepository);
    this.loadSparql = this.loadSparql.bind(this);
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   */
  private loadSparql(sparql: string): void {
    this.dataSource.getForSparql(sparql)
    .then((ds) => this.setState({ data: ds }))
    .catch(e => {
      if (e instanceof HttpError) {
        this.setState({error: {message: e.message}});
        return;
      }
      throw e;
    });
  }

  public override render() {
    let resultsView = (
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-80 text-center text-gray-400 text-bold p-8">
            Run SPARQL query to show content
          </div>
        </div>
    );
    if (this.state.data?.graph) {
      console.log(this.state.data.graph);
      resultsView = (
        <div className="max-w-7xl mx-auto mb-4">
          <GraphView data={this.state.data}></GraphView>
        </div>
      );
    }
    if (this.state.data?.tabular) {
      console.log(this.state.data.tabular);
      resultsView = (
        <div className="max-w-7xl mx-auto mb-4">
          <TableView data={this.state.data}></TableView>
        </div>
      );
    }
    if (this.state.error) {
      resultsView = <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-fau-red text-bold p-8">
        Failed to load the data
      </div>
    </div>
    }
    return (
      <>
        <header className="bg-white shadow">
          <div className="flex max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
            <div className="hidden md:block ml-auto">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Adjust graph design</span>
                  <AdjustmentsIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {resultsView}
          </div>
          <SparqlEditor
            sparql="CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"
            onSubmit={this.loadSparql}
          ></SparqlEditor>
        </main>
      </>
    );
  }
}

export default Explorer;
