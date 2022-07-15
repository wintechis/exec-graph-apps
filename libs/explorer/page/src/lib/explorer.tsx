import {
  HttpClient,
  FetchHttpClient,
  HttpSparqlRepository,
  RemoteDataSource,
  HttpError,
} from '@exec-graph/graph/data-source-remote';
import {
  DataSet,
  DataSourceRequestStatus,
  getObjectLabel,
  Graph,
} from '@exec-graph/graph/types';
import GraphView, { SetLayout } from '@exec-graph/data-viewer/graph-2d';
import { TableView } from '@exec-graph/data-viewer/table';
import { Component, createRef, RefObject } from 'react';
import {
  HiOutlineAdjustments,
  HiOutlineQuestionMarkCircle,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineSearchCircle,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineArrowDown,
  HiX,
} from 'react-icons/hi';
import DetailView from './detail-view/detail-view';
import { QueryEditor } from '@exec-graph/explorer/query-editor';
import Dialog from '@exec-graph/ui-react/dialog';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import LoadingBar, {
  LoadingStatus,
  Step,
} from '@exec-graph/ui-react/loading-bar';
import SearchDialog, { Match } from './search-dialog/search-dialog';

/**
 * Type definition of mandatory and optional properties of the {@link Explorer} component
 */
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
  RENDERING_DATA,
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
  SEARCH,
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
 * Function for local search of the current graph
 */
function searchGraph(graph: Graph): (query: string) => Match[] {
  return (query: string) =>
    Array.from(graph.nodeEntries())
      .filter(({ node, attributes }) =>
        getObjectLabel(node, attributes).toLocaleLowerCase().includes(query)
      )
      .map(({ node, attributes }) => ({
        uri: node,
        label: getObjectLabel(node, attributes),
      }));
}

/**
 * Type definition of the internal state of the {@link Explorer} component
 */
interface ExplorerState {
  /**
   * stores the currently loaded data
   */
  data?: DataSet;
  /**
   * stores the error if an error during loading of the data occured
   */
  error?: {
    message: string;
  };
  /**
   * Loading status indicator
   */
  status: Status;
  selectedObject?: string | null;
  /**
   * Indicates which dialog should be shown to the user
   */
  dialog: Dialogs;
  query: string;
}

/**
 * Top-level view component to display the Explore page on the website.
 *
 * Responsible to manage the shared state of all settings and viewer components.
 *
 * @category React Component
 */
export class Explorer extends Component<ExplorerProps, ExplorerState> {
  private dataSource: RemoteDataSource;
  private detailViewRef: RefObject<HTMLDivElement>;

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
    this.viewCompletedLoading = this.viewCompletedLoading.bind(this);
    this.handleScrollButtonClick = this.handleScrollButtonClick.bind(this);
    this.detailViewRef = createRef();
  }

  /**
   * React-Lifecycle-Hook used to initiate loading of default query once the component after the page was opened.
   */
  override componentDidMount(): void {
    this.loadSparql(DEFAULT_QUERY);
  }

  /**
   * Selects the given uri across the whole page
   *
   * Closes any open dialog to return focus to the base page with the new selection
   *
   * @param uri the URI of the selected object in the graph or null to remove selection
   */
  private handleSelectionChange(uri: string | null): void {
    this.setState({
      selectedObject: uri,
      dialog: Dialogs.NONE,
    });
  }

  /**
   * Click handler on scroll button for scrolling to the detail view
   */
  private handleScrollButtonClick() {
    this.detailViewRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  /**
   * Marks the component as loaded once the data has been processed and is shown to the user.
   */
  private viewCompletedLoading(): void {
    this.setState({ status: Status.LOADED });
  }

  /**
   * Takes changed queries from the SPARQL editor and executes them through the set data source
   *
   * @param sparql valid sparql query
   */
  private loadSparql(sparql: string): void {
    // we temporarily deselect the node to work around issues if the node is not part of the graph anymore
    const lastSelectedNode = this.state.selectedObject;
    this.setState({
      status: Status.NO_REQUEST_MADE,
      dialog: Dialogs.NONE,
      query: sparql,
      selectedObject: null,
    });
    this.dataSource
      .getForSparql(sparql, (s) => {
        // This state will often be deferred by react, can't do much about it...
        this.setState({
          status:
            s === DataSourceRequestStatus.PROCESSING_DATA
              ? Status.PROCESSING_RESPONSE
              : Status.EXECUTING_QUERY,
        });
      })
      .then((ds) => {
        if (ds.graph) ds.graph = SetLayout(ds.graph);
        return ds;
      })
      .then((ds) => {
        this.setState({
          status: Status.RENDERING_DATA,
          selectedObject: lastSelectedNode,
          data: ds,
        });
      })
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

  /**
   * Combines the different sections to create the Explorer page
   * @returns Explorer page
   */
  public override render(): JSX.Element {
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
   *
   * @returns Fragement with all dialog components
   */
  private renderDialogs(): JSX.Element {
    return (
      <>
        <Dialog
          show={this.state.dialog === Dialogs.HELP}
          close={this.showDialog(Dialogs.NONE)}
          width="max-w-xl"
          title="Welcome to the explorer!"
        >
          <p className="p-4">
            TODO: Help Text + Navigating the graph + Search &amp; Custom queries
            + Styling etc.
          </p>
        </Dialog>
        <SearchDialog
          show={this.state.dialog === Dialogs.SEARCH}
          close={this.showDialog(Dialogs.NONE)}
          dataSource={this.dataSource}
          queryLocal={
            this.state.data?.graph
              ? searchGraph(this.state.data?.graph)
              : undefined
          }
          selectLocal={this.handleSelectionChange}
          runSparql={this.loadSparql}
        ></SearchDialog>
        <Dialog
          show={this.state.dialog === Dialogs.QUERY_EDITOR}
          close={this.showDialog(Dialogs.NONE)}
          width="max-w-5xl"
        >
          <QueryEditor
            dataSource={this.dataSource}
            sparql={this.state.query}
            onSubmit={this.loadSparql}
            title={
              <HeadlessDialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
                Query Editor
              </HeadlessDialog.Title>
            }
          ></QueryEditor>
        </Dialog>
        <Dialog
          show={this.state.dialog === Dialogs.STYLE_EDITOR}
          close={this.showDialog(Dialogs.NONE)}
          width="max-w-xl"
          title="Adjust the styling"
        >
          <p className="p-4">
            Once created, this dialog may allow customizing the styling of the
            graph.
          </p>
        </Dialog>
      </>
    );
  }

  /**
   * Displays the passed dialog, pass `Dialogs.NONE` to hide the current dialog.
   *
   * @param dialog reference to the dialog to show
   */
  private showDialog(dialog: Dialogs): () => void {
    return () =>
      this.setState({
        ...this.state,
        dialog,
        // selectedObjectChangeFromOthers: null,
      });
  }

  /**
   * Creates the header bar at the top of the page
   *
   * @retuns page header
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
                className="p-1 px-2 flex rounded-full bg-gray-100 text-gray-800 hover:text-white hover:bg-fau-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-2"
              >
                <HiOutlineQuestionMarkCircle />
                <span className="hidden sm:inline pl-1">Help</span>
              </button>
              <button
                onClick={this.showDialog(Dialogs.SEARCH)}
                type="button"
                className="p-1 px-2 flex rounded-full bg-gray-100 text-gray-800 hover:text-white hover:bg-fau-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-2"
              >
                <HiOutlineSearch className="h-6 w-6" aria-hidden="true" />
                <span className="hidden sm:inline pl-1">Search</span>
              </button>
              <button
                onClick={this.showDialog(Dialogs.QUERY_EDITOR)}
                type="button"
                className="p-1 px-2 flex rounded-full bg-gray-100 text-gray-800 hover:text-white hover:bg-fau-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-0"
              >
                <HiOutlineFilter className="h-6 w-6" aria-hidden="true" />
                <span className="hidden sm:inline pl-1">Filter</span>
              </button>
            </div>
          </div>
        </div>
        <LoadingBar steps={this.loadingStatus()}></LoadingBar>
      </header>
    );
  }

  /**
   * Converts the Status stored in the state to a step list that can be passed to the progress bar component
   *
   * @returns list of steps for each part of the loading process
   */
  private loadingStatus(): Step[] {
    return [
      {
        name: 'Executing Query',
        width: 'w-3/6',
        status:
          this.state.status === Status.EXECUTING_QUERY
            ? LoadingStatus.PENDING
            : this.state.status === Status.ERROR
            ? LoadingStatus.ERROR
            : this.state.status === Status.NO_REQUEST_MADE
            ? LoadingStatus.NOT_STARTED
            : this.state.status === Status.PROCESSING_RESPONSE ||
              this.state.status === Status.RENDERING_DATA ||
              this.state.status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
      {
        name: 'Processing Result',
        width: 'w-1/6',
        status:
          this.state.status === Status.PROCESSING_RESPONSE
            ? LoadingStatus.PENDING
            : this.state.status === Status.ERROR
            ? LoadingStatus.ERROR
            : this.state.status === Status.NO_REQUEST_MADE ||
              this.state.status === Status.EXECUTING_QUERY
            ? LoadingStatus.NOT_STARTED
            : this.state.status === Status.RENDERING_DATA ||
              this.state.status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
      {
        name: 'Rendering Data',
        width: 'w-2/6',
        status:
          this.state.status === Status.RENDERING_DATA
            ? LoadingStatus.PENDING
            : this.state.status === Status.ERROR
            ? LoadingStatus.ERROR
            : this.state.status === Status.NO_REQUEST_MADE ||
              this.state.status === Status.EXECUTING_QUERY ||
              this.state.status === Status.PROCESSING_RESPONSE
            ? LoadingStatus.NOT_STARTED
            : this.state.status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
    ];
  }

  /**
   * Creates the section displaying the result (dataset or status)
   *
   * @returns the upper section with the results
   */
  private resultsView(): JSX.Element {
    if (this.state.data?.graph) {
      const pageSpecificControls = (
        <>
          <button
            onClick={this.handleScrollButtonClick}
            className="flex p-2 items-center"
          >
            <HiOutlineArrowDown className="w-5 h-5 mr-2" /> Show Details
          </button>
          {this.state.selectedObject && (
            <button
              onClick={() => this.handleSelectionChange(null)}
              className="flex p-2 items-center ml-2"
            >
              <HiX className="w-5 h-5 mr-2" /> Clear Selection
            </button>
          )}
        </>
      );
      return (
        <GraphView
          data={this.state.data}
          height="80vh"
          onSelectionChange={this.handleSelectionChange}
          selectedObject={this.state.selectedObject}
          onLoaded={this.viewCompletedLoading}
          pageSpecificControls={pageSpecificControls}
        ></GraphView>
      );
    }
    if (this.state.data?.tabular) {
      this.viewCompletedLoading();
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

  /**
   * Creates an inline notification to indicate that no data was loaded
   *
   * @returns inline notification fragement
   */
  private resultSectionNoRequest(): JSX.Element {
    return this.inlineNotification(
      <>
        <HiOutlineSearchCircle className="h-6 w-6" />
        <h3 className="mt-4 text-2xl font-bold">Exploring the ExecGraph</h3>
        <div className="max-w-prose">
          To get started make your first query with the{' '}
          <button className="fau-link inline-flex">
            <HiOutlineAdjustments className="h-5 w-4 mr-1" /> query editor
          </button>
          .
        </div>
      </>
    );
  }

  /**
   * Creates an inline notification to indicate that data is being loaded
   *
   * @returns inline notification fragement
   */
  private resultSectionLoading(): JSX.Element {
    return this.inlineNotification(
      <>
        <HiOutlineRefresh className="animate-spin h-6 w-6" />
        <h3 className="mt-4 text-2xl font-bold">Loading</h3>
        <div className="max-w-prose">The ExecGraph data is being loaded.</div>
      </>
    );
  }

  /**
   * Creates an inline notification to indicate that data failed to load
   *
   * @returns inline notification fragement
   */
  private resultSectionError(): JSX.Element {
    return this.inlineNotification(
      <>
        <HiOutlineExclamationCircle className="text-fau-red h-6 w-6" />
        <h3 className="mt-4 text-2xl text-fau-red font-bold">Error</h3>
        <div className="max-w-prose">
          Sorry, we have encountered an issue while loading the ExecGraph data.
        </div>
        <pre className="max-w-prose mt-4">{this.state.error?.message}</pre>
      </>
    );
  }

  /**
   * Creates an inline notification template
   *
   * @returns inline notification container
   */
  private inlineNotification(content: JSX.Element): JSX.Element {
    return (
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <div className="bg-white h-64 p-8 max-w-4xl">{content}</div>
      </div>
    );
  }

  /**
   * Adds the section to show details of the selected object
   *
   * @returns detail view or help when detail view is supported by current data or null if not
   */
  private detailView(): JSX.Element | null {
    if (!this.state.data?.graph) {
      return null; // only enable details when in graph view
    }
    if (!this.state.selectedObject) {
      return (
        <div className="bg-white" ref={this.detailViewRef}>
          <div className="max-w-7xl mx-auto px-4 py-6 h-64">
            <HiOutlineQuestionMarkCircle className="h-6 w-6" />
            <h3 className="mt-4 text-2xl font-bold">Details</h3>
            <div className="max-w-prose">
              Select a node in the graph to see more details.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div ref={this.detailViewRef}>
        <DetailView
          mainDataSource={this.dataSource}
          data={this.state.data}
          selectedObject={this.state.selectedObject}
          onSelect={this.handleSelectionChange}
        ></DetailView>
      </div>
    );
  }
}

export default Explorer;
