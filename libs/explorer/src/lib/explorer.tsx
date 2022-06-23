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
  AdjustmentsIcon,
  ExclamationCircleIcon,
  FilterIcon,
  QuestionMarkCircleIcon,
  RefreshIcon,
  SearchCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import DetailView from './detail-view/detail-view';
import { SetLayout } from './graph-view/utils/layoutController';
import { QueryEditor } from '@exec-graph/query-editor';
import LoadingBar, { LoadingStatus, Step } from './loading-bar/loading-bar';
import { Dialog } from '@headlessui/react';
import ExploreDialog from './dialog/dialog';

export interface ExplorerProps {
  /** URL pointing to a remote SPARQL dndpoint */
  sparqlEndpoint: string;
}

/**
 * Indicates the loading status of the graph/table data on the explore page
 */
export enum Status {
  NO_REQUEST_MADE,
  EXECUTING_QUERY,
  PROCESSING_RESPONSE,
  LOADED,
  ERROR,
}

/**
 * List of all dialogs on the explore page,
 * enum used to indicate which one is shown.
 */
enum Dialogs {
  NONE,
  HELP,
  QUERY_EDITOR,
  STYLE_EDITOR,
}

/**
 * This is the inital query executed upon opening
 */
const DEFAULT_QUERY = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>

CONSTRUCT {?s ?p ?o}
WHERE {
    ?s ?p ?o.
    ?s rdf:type ?c.
    FILTER (?c IN ( schema:City,schema:Person, schema:Organization,schema:CollegeOrUniversity ) )
}`;

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
    dialog: Dialogs;
    query: string;
  }
> {
  private dataSource: RemoteDataSource;

  constructor(props: ExplorerProps) {
    super(props);
    this.state = {
      status: Status.NO_REQUEST_MADE,
      dialog: Dialogs.NONE,
      query: '',
    };
    const httpClient: HttpClient = new FetchHttpClient();
    const sparqlRepository = new HttpSparqlRepository(
      props.sparqlEndpoint,
      httpClient
    );
    this.dataSource = new RemoteDataSource(sparqlRepository);
    this.loadSparql = this.loadSparql.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleGraphSelectionChanged =
      this.handleGraphSelectionChanged.bind(this);
  }

  override componentDidMount() {
    this.loadSparql(DEFAULT_QUERY);
  }

  /**
   * Selects the given uri across the whole page
   *
   * Closes any open dialog to return focus to the base page with the new selection
   */
  private handleSelectionChange(uri: string | null) {
    this.setState({
      selectedObjectChangeFromOthers: uri,
      dialog: Dialogs.NONE,
    });
  }

  /**
   * Special click handler for the graph to avoid redrawing
   */
  private handleGraphSelectionChanged(clickedNode: string | null) {
    this.setState({ selectedObject: clickedNode });
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   */
  private loadSparql(sparql: string): void {
    // TODO Create a loading status separation between request & response processing
    this.setState({
      ...this.state,
      status: Status.EXECUTING_QUERY,
      query: sparql,
    });
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
          selectedObject:
            this.state.selectedObject &&
            ds.graph?.hasNode(this.state.selectedObject)
              ? this.state.selectedObject
              : null,
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
    return (
      <>
        {this.renderHeader()}
        <main>
          {this.resultsView()}
          {this.detailView()}
        </main>
        {this.renderDialogs()}
      </>
    );
  }

  /**
   * Adds all dialogs to the component tree
   */
  private renderDialogs(): JSX.Element {
    return (
      <>
        <ExploreDialog
          show={this.state.dialog === Dialogs.HELP}
          close={() => this.showDialog(Dialogs.NONE)}
          width="max-w-xl"
          title="Welcome to the explorer!"
        >
          <p className="p-4">
            TODO: Help Text + Navigating the graph + Search &amp; Custom queries
            + Styling etc.
          </p>
        </ExploreDialog>
        <ExploreDialog
          show={this.state.dialog === Dialogs.QUERY_EDITOR}
          close={() => this.showDialog(Dialogs.NONE)}
          width="max-w-7xl"
        >
          <QueryEditor
            dataSource={this.dataSource}
            sparql={this.state.query}
            onSubmit={this.loadSparql}
            title={
              <Dialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
                Query Editor
              </Dialog.Title>
            }
          ></QueryEditor>
        </ExploreDialog>
        <ExploreDialog
          show={this.state.dialog === Dialogs.STYLE_EDITOR}
          close={() => this.showDialog(Dialogs.NONE)}
          width="max-w-xl"
          title="Adjust the styling"
        >
          <p className="p-4">
            Once created, this dialog may allow customizing the styling of the
            graph.
          </p>
        </ExploreDialog>
      </>
    );
  }

  private showDialog(dialog: Dialogs): () => void {
    return () => this.setState({ ...this.state, dialog });
  }

  /**
   * Creates the header bar at the top of the page
   */
  private renderHeader(): JSX.Element {
    return (
      <header className="bg-white shadow sticky top-[-1rem] z-[200]">
        <div className="flex items-baseline max-w-7xl mx-auto py-6 px-4 pb-2 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <div className="block ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={this.showDialog(Dialogs.HELP)}
                type="button"
                className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4"
              >
                <span className="sr-only">Help</span>
                <QuestionMarkCircleIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                onClick={this.showDialog(Dialogs.QUERY_EDITOR)}
                type="button"
                className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4"
              >
                <span className="sr-only">Filter</span>
                <FilterIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                onClick={this.showDialog(Dialogs.STYLE_EDITOR)}
                type="button"
                className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Adjust graph design</span>
                <AdjustmentsIcon className="h-6 w-6" aria-hidden="true" />
              </button>
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
  private resultsView(): JSX.Element {
    if (this.state.data?.graph) {
      return (
        <MemoizedGraphView
          data={this.state.data}
          setSelectedObject={this.handleGraphSelectionChanged}
          selectedObjectChangeFromOthers={
            this.state.selectedObjectChangeFromOthers
          }
          handleSelectionChangeFromOthers={this.handleSelectionChange}
        ></MemoizedGraphView>
      );
    }
    if (this.state.data?.tabular) {
      return (
        <div className="max-w-7xl mx-auto mb-4 mt-4">
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
          To get started make your first query with the{' '}
          <button className="fau-link inline-flex">
            <AdjustmentsIcon className="h-5 w-4 mr-2"></AdjustmentsIcon> query
            editor
          </button>
          .
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
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <div className="bg-white h-64 p-8 max-w-4xl">{content}</div>
      </div>
    );
  }

  private detailView(): JSX.Element | null {
    if (!this.state.data?.graph) {
      return null; // only enable details when in graph view
    }
    if (!this.state.selectedObject) {
      return (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6 h-64">
            <QuestionMarkCircleIcon className="h-6 w-6"></QuestionMarkCircleIcon>
            <h3 className="mt-4 text-2xl font-bold">Details</h3>
            <div className="max-w-prose">
              Select a node in the graph to see more details.
            </div>
          </div>
        </div>
      );
    }
    return (
      <DetailView
        mainDataSource={this.dataSource}
        data={this.state.data}
        selectedObject={this.state.selectedObject}
        onSelect={this.handleSelectionChange}
      ></DetailView>
    );
  }
}

export default Explorer;
