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
import {
  ExclamationCircleIcon,
  RefreshIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline';
import DetailView from './detail-view/detail-view';
import { SetLayout } from './graph-view/utils/layoutController';
import { QueryEditor } from '@exec-graph/query-editor';
import LoadingBar, { LoadingStatus, Step } from './loading-bar/loading-bar';

export interface ExplorerProps {
  /** URL pointing to a remote SPARQL dndpoint */
  sparqlEndpoint: string;
}

export enum Status {
  NO_REQUEST_MADE,
  EXECUTING_QUERY,
  PROCESSING_RESPONSE,
  LOADED,
  ERROR,
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
    status: Status;
    selectedObject?: string | null;
    selectedObjectChangeFromOthers?: string | null;
  }
> {
  private dataSource: RemoteDataSource;

  constructor(props: ExplorerProps) {
    super(props);
    this.state = { status: Status.NO_REQUEST_MADE };
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

  private setSelectedObject(clickedNode: string | null) {
    this.setState({ selectedObject: clickedNode });
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   */
  private loadSparql(sparql: string): void {
    // TODO Create a loading status separation between request & response processing
    this.setState({ ...this.state, status: Status.EXECUTING_QUERY });
    this.dataSource
      .getForSparql(sparql)
      .then((ds) => {
        if (ds.graph) ds.graph = SetLayout(ds.graph);
        return ds;
      })
      .then((ds) =>
        this.setState({
          status: Status.LOADED,
          data: ds,
          selectedObject: ds.graph?.nodes()[20] || null,
        })
      )
      .catch((e) => {
        if (e instanceof HttpError) {
          this.setState({
            error: { message: e.message },
            status: Status.ERROR,
          });
          return;
        }
        throw e;
      });
  }

  public override render() {
    const parentDivId = 'ResultViewParentDiv';

    return (
      <>
        {this.renderHeader()}
        <main>
          <div id={parentDivId}>
            <div className="max-w-7xl mx-auto mb-4 mt-4">
              {this.resultsView(parentDivId)}
            </div>
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

  /**
   * Creates the header bar at the top of the page
   */
  private renderHeader(): JSX.Element {
    return (
      <header className="bg-white shadow">
        <div className="flex max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <div className="hidden md:block ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              {/*<button
              type="button"
              className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Adjust graph design</span>
              <AdjustmentsIcon className="h-6 w-6" aria-hidden="true" />\
            </button>*/}
            </div>
          </div>
        </div>
        <LoadingBar steps={this.loadingStatus()}></LoadingBar>
      </header>
    );
  }

  private loadingStatus(): Step[] {
    return [
      {
        name: 'Executing Query',
        width: 'w-4/6',
        status:
          this.state.status === Status.EXECUTING_QUERY
            ? LoadingStatus.PENDING
            : this.state.status === Status.ERROR
            ? LoadingStatus.ERROR
            : this.state.status === Status.NO_REQUEST_MADE
            ? LoadingStatus.NOT_STARTED
            : this.state.status === Status.PROCESSING_RESPONSE ||
              this.state.status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
      {
        name: 'Processing Result',
        width: 'w-2/6',
        status:
          this.state.status === Status.PROCESSING_RESPONSE
            ? LoadingStatus.PENDING
            : this.state.status === Status.ERROR
            ? LoadingStatus.ERROR
            : this.state.status === Status.NO_REQUEST_MADE
            ? LoadingStatus.NOT_STARTED
            : this.state.status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
    ];
  }

  /**
   * Creates the section displaying the result (dataset or status)
   */
  private resultsView(parentDivId: string): JSX.Element {
    if (this.state.data?.graph) {
      return (
        <div className="mb-4">
          <MemoizedGraphView
            data={this.state.data}
            setSelectedObject={this.setSelectedObject}
            selectedObjectChangeFromOthers={
              this.state.selectedObjectChangeFromOthers
            }
            handleSelectionChangeFromOthers={
              this.handleSelectionChangeFromOthers
            }
            parentDivId={parentDivId}
          ></MemoizedGraphView>
        </div>
      );
    }
    if (this.state.data?.tabular) {
      return (
        <div className="mb-4">
          <TableView data={this.state?.data}></TableView>
        </div>
      );
    }
    // no data available, check status:
    if (this.state.status === Status.ERROR) {
      return this.resultSectionError();
    } else if (
      this.state.status === Status.EXECUTING_QUERY ||
      this.state.status === Status.PROCESSING_RESPONSE
    ) {
      return this.resultSectionLoading();
    }
    // Status should now be NO_REQUEST_MADE
    return this.resultSectionNoRequest();
  }

  private resultSectionNoRequest(): JSX.Element {
    return this.inlineNotification(
      <>
        <SearchCircleIcon className="h-6 w-6"></SearchCircleIcon>
        <h3 className="mt-4 text-2xl font-bold">Exploring the ExecGraph</h3>
        <div className="max-w-prose">
          To get started make your first query with the query editor below.
        </div>
      </>
    );
  }

  private resultSectionLoading(): JSX.Element {
    return this.inlineNotification(
      <>
        <RefreshIcon className="animate-spin h-6 w-6"></RefreshIcon>
        <h3 className="mt-4 text-2xl font-bold">Loading</h3>
        <div className="max-w-prose">The ExecGraph data is being loaded.</div>
      </>
    );
  }

  private resultSectionError(): JSX.Element {
    return this.inlineNotification(
      <>
        <ExclamationCircleIcon className="text-fau-red h-6 w-6"></ExclamationCircleIcon>
        <h3 className="mt-4 text-2xl text-fau-red font-bold">Error</h3>
        <div className="max-w-prose">
          Sorry, we have encountered an issue while loading the ExecGraph data.
        </div>
        <pre className="max-w-prose mt-4">{this.state.error?.message}</pre>
      </>
    );
  }

  private inlineNotification(content: JSX.Element): JSX.Element {
    return (
      <div className="px-4 py-6">
        <div className="bg-white h-64 p-8 max-w-4xl">{content}</div>
      </div>
    );
  }

  private detailView(): JSX.Element | null {
    if (!this.state.selectedObject) {
      return null;
    }
    return (
      <DetailView
        mainDataSource={this.dataSource}
        data={this.state.data}
        selectedObject={this.state.selectedObject}
        onSelect={this.handleSelectionChangeFromOthers}
      ></DetailView>
    );
  }
}

export default Explorer;
