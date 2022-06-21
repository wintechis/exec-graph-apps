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
import { MemoizedGraphView} from './graph-view/graph-view';
import { SetLayout } from './graph-view/utils/layoutController';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import { DetailView } from '@exec-graph/detail-view';
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
    selectedObjectChangeFromOthers?: string | null;
  }
> {
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
    this.handleSelectionChangeFromOthers =
      this.handleSelectionChangeFromOthers.bind(this);
    this.setSelectedObject = this.setSelectedObject.bind(this);
  }

  handleSelectionChangeFromOthers(uri: string | null) {
    this.setState({ selectedObjectChangeFromOthers: uri });
  }

  private setSelectedObject(clickedNode: string | null): void {
    this.setState({ selectedObject: clickedNode });
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   */
  private loadSparql(sparql: string): void {
    this.dataSource
      .getForSparql(sparql)
      .then((ds) => {
        if (ds.graph) ds.graph = SetLayout(ds.graph);
        return ds;
      })
      .then((ds) =>
        this.setState({
          data: ds,
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

  public override render() {
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
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-80 text-center text-gray-400 text-bold p-8">
          Run SPARQL query to show content
        </div>
      </div>
    );
    if (this.state.data?.graph) {
      resultsView = (
        <div className="max-w-7xl mx-auto mb-4">
          <MemoizedGraphView
            data={this.state.data}
            setSelectedObject={this.setSelectedObject}
            selectedObjectChangeFromDetails={
              this.state.selectedObjectChangeFromOthers
            }
            handleSelectionChangeFromOthers={
              this.handleSelectionChangeFromOthers
            }
          ></MemoizedGraphView>
        </div>
      );
    }
    if (this.state.data?.tabular) {
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
    return resultsView;
  }

  private detailView(): JSX.Element | null {
    if (!this.state.data?.graph || !this.state.selectedObject) {
      return null;
    }
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
          <DetailView
            data={this.state.data}
            selectedObject={this.state.selectedObject}
            schema={this.state.data.schema}
            onSelect={this.handleSelectionChangeFromOthers}
          ></DetailView>
        </div>
      </div>
    );
  }
}

export default Explorer;
