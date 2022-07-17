import { RemoteDataSourceFactory } from '@exec-graph/graph/data-source-remote';
import { DataSource, getObjectLabel, Graph } from '@exec-graph/graph/types';
import { Component } from 'react';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineFilter,
  HiOutlineSearch,
} from 'react-icons/hi';
import { QueryEditor } from '@exec-graph/explorer/query-editor';
import Dialog, { DialogErrorBoundary } from '@exec-graph/ui-react/dialog';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import LoadingBar, {
  LoadingStatus,
  Step,
} from '@exec-graph/ui-react/loading-bar';
import SearchDialog, { Match } from './search-dialog/search-dialog';
import ExplorerHelpText from './explorer-help-text/explorer-help-text';
import GraphDataManager, {
  GraphDataContext,
  Status,
} from './graph-data-manager/graph-data-manager';
import ResultsView from './results-view/results-view';
import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import { Query } from '@exec-graph/explorer/types';

/**
 * Type definition of mandatory and optional properties of the {@link Explorer} component
 */
export interface ExplorerProps {
  /** URL pointing to a remote SPARQL dndpoint */
  sparqlEndpoint: string;
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
const DEFAULT_QUERY = {
  title: 'Default Query',
  sparql: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>

CONSTRUCT {?s ?p ?o}
WHERE {
    ?s ?p ?o.
    ?s rdf:type ?c.
    FILTER (?c IN ( schema:City, schema:Person, schema:Organization, schema:CollegeOrUniversity ) )
}`,
};

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
   * Indicates which dialog should be shown to the user
   */
  dialog: Dialogs;
}

/**
 * Top-level view component to display the Explore page on the website.
 *
 * Responsible to manage the shared state of all settings and viewer components.
 *
 * @category React Component
 */
export class Explorer extends Component<ExplorerProps, ExplorerState> {
  private dataSource: DataSource;

  constructor(props: ExplorerProps) {
    super(props);
    this.state = { dialog: Dialogs.NONE };
    this.dataSource = RemoteDataSourceFactory(
      props.sparqlEndpoint,
      DEFAULT_SCHEMA
    );
  }

  /**
   * Combines the different sections to create the Explorer page
   * @returns Explorer page
   */
  public override render(): JSX.Element {
    return (
      <GraphDataManager
        dataSource={this.dataSource}
        defaultQuery={DEFAULT_QUERY}
      >
        {this.renderHeader()}
        <main>
          <ResultsView />
        </main>
        {this.renderDialogs()}
      </GraphDataManager>
    );
  }

  /**
   * Adds all dialogs to the component tree
   *
   * @returns Fragement with all dialog components
   */
  private renderDialogs(): JSX.Element {
    return (
      <DialogErrorBoundary
        show={this.state.dialog !== Dialogs.NONE}
        close={this.showDialog(Dialogs.NONE)}
      >
        <>
          <Dialog
            show={this.state.dialog === Dialogs.HELP}
            close={this.showDialog(Dialogs.NONE)}
            width="max-w-3xl"
            title="Welcome to the explorer!"
          >
            <ExplorerHelpText
              className="overflow-y-auto sm:pr-24"
              style={{ height: '70vh' }}
            />
          </Dialog>
          <GraphDataContext.Consumer>
            {(value) => (
              <SearchDialog
                show={this.state.dialog === Dialogs.SEARCH}
                close={this.showDialog(Dialogs.NONE)}
                dataSource={this.dataSource}
                queryLocal={
                  value.data?.graph ? searchGraph(value.data?.graph) : undefined
                }
                selectLocal={(uri) =>
                  this.closeDialogAnd(() => value.selectObject(uri))
                }
                runSparql={(sparql: string) =>
                  this.closeDialogAnd(() =>
                    value.setQuery({ sparql, title: 'Search' })
                  )
                }
              ></SearchDialog>
            )}
          </GraphDataContext.Consumer>
          <Dialog
            show={this.state.dialog === Dialogs.QUERY_EDITOR}
            close={this.showDialog(Dialogs.NONE)}
            width="max-w-5xl"
          >
            <GraphDataContext.Consumer>
              {(value) => (
                <QueryEditor
                  history={value.history}
                  dataSource={this.dataSource}
                  query={value.query || DEFAULT_QUERY}
                  onSubmit={(query: Query) =>
                    this.closeDialogAnd(() => value.setQuery(query))
                  }
                  title={
                    <HeadlessDialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
                      Query Editor
                    </HeadlessDialog.Title>
                  }
                ></QueryEditor>
              )}
            </GraphDataContext.Consumer>
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
      </DialogErrorBoundary>
    );
  }

  /**
   * Displays the passed dialog, pass `Dialogs.NONE` to hide the current dialog.
   *
   * @param dialog reference to the dialog to show
   */
  private showDialog(dialog: Dialogs): () => void {
    return () => this.setState({ dialog });
  }

  /**
   * Closes the current dialog and executes a function afterwards
   *
   * @param callbacFn function to execute after closing the dialog
   */
  private closeDialogAnd(callbackFn?: () => void): void {
    return this.setState({ dialog: Dialogs.NONE }, callbackFn);
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
                <HiOutlineQuestionMarkCircle
                  className="h-6 w-6"
                  aria-hidden="true"
                />
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
        <GraphDataContext.Consumer>
          {({ status }) => (
            <LoadingBar steps={this.loadingStatus(status)}></LoadingBar>
          )}
        </GraphDataContext.Consumer>
      </header>
    );
  }

  /**
   * Converts the Status stored in the state to a step list that can be passed to the progress bar component
   *
   * @returns list of steps for each part of the loading process
   */
  private loadingStatus(status: Status): Step[] {
    return [
      {
        name: 'Executing Query',
        width: 'w-3/6',
        status:
          status === Status.EXECUTING_QUERY
            ? LoadingStatus.PENDING
            : status === Status.ERROR
            ? LoadingStatus.ERROR
            : status === Status.NO_REQUEST_MADE
            ? LoadingStatus.NOT_STARTED
            : status === Status.PROCESSING_RESPONSE ||
              status === Status.RENDERING_DATA ||
              status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
      {
        name: 'Processing Result',
        width: 'w-1/6',
        status:
          status === Status.PROCESSING_RESPONSE
            ? LoadingStatus.PENDING
            : status === Status.ERROR
            ? LoadingStatus.ERROR
            : status === Status.NO_REQUEST_MADE ||
              status === Status.EXECUTING_QUERY
            ? LoadingStatus.NOT_STARTED
            : status === Status.RENDERING_DATA || status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
      {
        name: 'Rendering Data',
        width: 'w-2/6',
        status:
          status === Status.RENDERING_DATA
            ? LoadingStatus.PENDING
            : status === Status.ERROR
            ? LoadingStatus.ERROR
            : status === Status.NO_REQUEST_MADE ||
              status === Status.EXECUTING_QUERY ||
              status === Status.PROCESSING_RESPONSE
            ? LoadingStatus.NOT_STARTED
            : status === Status.LOADED
            ? LoadingStatus.LOADED
            : LoadingStatus.SKIPPED,
      },
    ];
  }
}

export default Explorer;
