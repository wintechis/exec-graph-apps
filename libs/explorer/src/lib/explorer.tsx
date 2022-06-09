import {
  HttpClient,
  FetchHttpClient,
  HttpSparqlRepository,
  RemoteDataSource,
  HttpError,
} from '@exec-graph/graph/data-source-remote';
import { DataSet } from '@exec-graph/graph/types';
import { Component } from 'react';
import TableView from './table-view/table-view';
import { MemoizedGraphView } from './graph-view/graph-view';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import DetailView from './detail-view/detail-view';
import { QueryEditor } from '@exec-graph/query-editor';

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
export class Explorer extends Component<
  ExplorerProps,
  {
    data?: DataSet;
    error?: { message: string };
    selectedObject?: string | null;
    detailData?: DataSet;
    hoveredNode: string | null;
    clickedNode: string | null;
    nodeDown: string | null;
  }
> {
  private dataSource: RemoteDataSource;

  constructor(props: ExplorerProps) {
    super(props);
    this.state = {
      hoveredNode: null,
      clickedNode: null,
      nodeDown: null,
    };
    const httpClient: HttpClient = new FetchHttpClient();
    const sparqlRepository = new HttpSparqlRepository(
      props.sparqlEndpoint,
      httpClient
    );
    this.state = {};
    this.dataSource = new RemoteDataSource(sparqlRepository);
    this.loadSparql = this.loadSparql.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  handleSelectionChange(uri: string) {
    this.setState({ selectedObject: uri });
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   */
  private loadSparql(sparql: string): void {
    this.dataSource
      .getForSparql(sparql)
      .then((ds) =>
        this.setState({
          data: ds,
          selectedObject: ds.graph?.nodes()[10] || null,
        })
      )
      .catch((e) => {
        if (e instanceof HttpError) {
          this.setState({ error: { message: e.message } });
          return;
        }
        throw e;
      });
  }

  private changeState(param: {
    hoveredNode?: string | null;
    clickedNode?: string | null;
    nodeDown?: string | null;
  }): void {
    if (param.hoveredNode) this.setState({ hoveredNode: param.hoveredNode });
    if (param.clickedNode) this.setState({ clickedNode: param.clickedNode });
    if (param.nodeDown) this.setState({ nodeDown: param.nodeDown });
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
          <MemoizedGraphView
            data={this.state.data}
            changeState={this.changeState}
          ></MemoizedGraphView>
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
      resultsView = (
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-fau-red text-bold p-8">
            Failed to load the data
          </div>
        </div>
      );
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
          <div className="max-w-7xl mx-auto mb-4 mt-4">
            {this.resultsView()}
          </div>
          <div className="mb-4">
            <div className="max-w-7xl mx-auto shadow">
              <QueryEditor
                dataSource={this.dataSource}
                sparql="CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"
                onSubmit={this.loadSparql}
              ></QueryEditor>
            </div>
          </div>
          {this.detailView()}
        </main>
      </>
    );
  }

  private resultsView() {
    let resultsView = (
      <>
        {/* Replace with your content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-80 text-center text-gray-400 text-bold p-8">
            Insert interactive graph here
          </div>
        </div>
        {/* /End replace */}
      </>
    );
    if (this.state.data?.tabular) {
      resultsView = (
        <div className="mb-4">
          <MemoizedGraphView
            data={this.state?.data}
            changeState={this.changeState}
          ></MemoizedGraphView>
        </div>
      );
    }
    if (this.state.error) {
      resultsView = (
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-fau-red text-bold p-8">
            Failed to load the data
          </div>
        </div>
      );
    }
    return resultsView;
  }

  private detailView(): JSX.Element | null {
    if (!this.state.selectedObject) {
      return null;
    }
    return (
      <DetailView
        mainDataSource={this.dataSource}
        data={this.state.detailData || this.state.data}
        selectedObject={this.state.selectedObject}
        onSelect={this.handleSelectionChange}
      ></DetailView>
    );
  }
}

export default Explorer;
