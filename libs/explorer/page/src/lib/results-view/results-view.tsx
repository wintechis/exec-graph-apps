import { TableView } from '@exec-graph/data-viewer/table';
import GraphView from '@exec-graph/data-viewer/graph-2d';
import { Component, createRef, RefObject } from 'react';
import {
  HiOutlineArrowDown,
  HiX,
  HiOutlineQuestionMarkCircle,
  HiOutlineAdjustments,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineSearchCircle,
} from 'react-icons/hi';
import DetailView from '../detail-view/detail-view';
import { ExplorerProps } from '../explorer';
import {
  GraphDataContextProperties,
  GraphDataContext,
  Status,
} from '../graph-data-manager/graph-data-manager';

/**
 * Creates an inline notification template
 *
 * @returns inline notification container
 */
function inlineNotification(content: JSX.Element): JSX.Element {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="bg-white h-64 p-8 max-w-4xl">{content}</div>
    </div>
  );
}

/**
 * Creates an inline notification to indicate that no data was loaded
 *
 * @returns inline notification fragement
 */
function resultSectionNoRequest(): JSX.Element {
  return inlineNotification(
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
function resultSectionLoading(): JSX.Element {
  return inlineNotification(
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
function resultSectionError(error?: { message: string }): JSX.Element {
  return inlineNotification(
    <>
      <HiOutlineExclamationCircle className="text-fau-red h-6 w-6" />
      <h3 className="mt-4 text-2xl text-fau-red font-bold">Error</h3>
      <div className="max-w-prose">
        Sorry, we have encountered an issue while loading the ExecGraph data.
      </div>
      <pre className="max-w-prose mt-4">{error?.message}</pre>
    </>
  );
}

/**
 * Takes the data, selection and status from the {@link GraphDataContext} and shows it in the appropriate views
 *
 * @category React Component
 */
export class ResultsView extends Component {
  /**
   * Keeps a reference to the DetailView so we can scroll to it
   */
  private detailViewRef: RefObject<HTMLDivElement>;

  constructor(props: ExplorerProps) {
    super(props);
    this.detailViewRef = createRef();
  }

  /**
   * Click handler on scroll button for scrolling to the detail view
   */
  private handleScrollButtonClick(): void {
    this.detailViewRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  /**
   * Creates the section displaying the result (dataset or status)
   *
   * @returns the upper section with the results
   */
  private visualisationView(
    graphData: GraphDataContextProperties
  ): JSX.Element {
    if (graphData.data?.graph) {
      const pageSpecificControls = (
        <>
          <button
            onClick={() => this.handleScrollButtonClick()}
            className="flex p-2 items-center"
          >
            <HiOutlineArrowDown className="w-5 h-5 mr-2" /> Show Details
          </button>
          {graphData.selectedObject && (
            <button
              onClick={() => graphData.selectObject(null)}
              className="flex p-2 items-center ml-2"
            >
              <HiX className="w-5 h-5 mr-2" /> Clear Selection
            </button>
          )}
        </>
      );
      return (
        <GraphView
          data={graphData.data}
          height="80vh"
          onSelectionChange={graphData.selectObject}
          selectedObject={graphData.selectedObject}
          onLoaded={graphData.viewCompletedLoading}
          pageSpecificControls={pageSpecificControls}
        ></GraphView>
      );
    }
    if (graphData.data?.tabular) {
      return (
        <div className="max-w-7xl mx-auto mb-4 mt-4">
          <TableView
            data={graphData.data}
            onLoaded={graphData.viewCompletedLoading}
          ></TableView>
        </div>
      );
    }
    // no data available, check status:
    if (graphData.status === Status.ERROR) {
      return resultSectionError(graphData.error);
    } else if (
      graphData.status === Status.EXECUTING_QUERY ||
      graphData.status === Status.PROCESSING_RESPONSE
    ) {
      return resultSectionLoading();
    }
    // Status should now be NO_REQUEST_MADE
    return resultSectionNoRequest();
  }

  /**
   * Adds the section to show details of the selected object
   *
   * @returns detail view or help when detail view is supported by current data or null if not
   */
  private detailView(
    graphData: GraphDataContextProperties
  ): JSX.Element | null {
    if (!graphData.data?.graph) {
      return null; // only enable details when in graph view
    }
    if (!graphData.selectedObject) {
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
          mainDataSource={graphData.dataSource}
          data={graphData.data}
          selectedObject={graphData.selectedObject}
          onSelect={graphData.selectObject}
        ></DetailView>
      </div>
    );
  }

  /**
   * Returns the best viewers for the current graph data context
   * @returns React component tree
   */
  public override render(): JSX.Element {
    return (
      <GraphDataContext.Consumer>
        {(graphData) => (
          <>
            {this.visualisationView(graphData)}
            {this.detailView(graphData)}
          </>
        )}
      </GraphDataContext.Consumer>
    );
  }
}

export default ResultsView;
