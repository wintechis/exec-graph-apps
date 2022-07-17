import { SetLayout } from '@exec-graph/data-viewer/graph-2d';
import { HttpError } from '@exec-graph/graph/data-source-remote';
import {
  DataSet,
  DataSource,
  DataSourceRequestStatus,
} from '@exec-graph/graph/types';
import { DateTime } from 'luxon';
import { createContext, useEffect, useState } from 'react';
import {
  Query,
  ExecutedQuery,
  SPARQL,
  History,
} from '@exec-graph/explorer/types';
import { LocalStorageQueryHistoryAdapter } from './local-storage-query-history.adapter';

/**
 * Converts a query to a history entry and adds it to the existing list
 */
function recordQueryExecution(
  currentHistory: ExecutedQuery[],
  query: Query
): ExecutedQuery[] {
  return [
    {
      ...query,
      executedAt: DateTime.utc().toISO(),
    },
    ...currentHistory,
  ];
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
 * Type definition for the {@link GraphDataContext}
 */
export interface GraphDataContextProperties {
  /**
   * the last executed query
   */
  query?: Query;
  /**
   * URI of the currently selected object
   */
  selectedObject?: string | null;
  /**
   * Loading status indicator
   */
  status: Status;
  /**
   * stores the error if an error during loading of the data occured
   */
  error?: {
    message: string;
  };
  /**
   * stores the currently loaded data
   */
  data?: DataSet | null;
  /**
   * keeps track of the latest queries
   */
  history: History;
  /**
   * the data source queries are run against, may be used to make follow-up queries
   */
  dataSource?: DataSource;
  /**
   * Sets changed queries to the context, which will trigger their execution through the set data source
   *
   * @param sparql valid sparql query
   */
  setQuery: (query: { sparql: SPARQL; title: string }) => void;
  /**
   * Sets the currently selected object for all consumers fo the context
   */
  selectObject: (object: string | null) => void;
  /**
   * Marks the status as loaded once the data has been processed and is shown to the user.
   */
  viewCompletedLoading: () => void;
}

/**
 * Empty "No-Op" default object for {@link GraphDataContext}
 */
export const DEFAULT_GRAPH_DATA_CONTEXT: GraphDataContextProperties = {
  status: Status.NO_REQUEST_MADE,
  history: {
    storedLocally: false,
    disableLocalStorage: () => null,
    enableLocalStorage: () => null,
    queries: [],
  },
  setQuery: () => null,
  selectObject: () => null,
  viewCompletedLoading: () => null,
};

/**
 * React Context element that tracks the state of graph data related information and makes them available to consumers
 */
export const GraphDataContext = createContext(DEFAULT_GRAPH_DATA_CONTEXT);

/**
 * Type definition of mandatory and optional properties of the {@link GraphDataManager} component
 */
export interface GraphDataManagerProps {
  children: JSX.Element | JSX.Element[];
  /**
   * The data source to query from, will also be made available to children
   */
  dataSource: DataSource;
  /**
   * This will be executed if no other query was set
   */
  defaultQuery?: Query;
}

/**
 * Manages and provides the GraphDataContext to its children
 *
 * As such it is responsible to manage the selection, querying and status of all graph data related matters.
 *
 * @returns React component wrapped around the child tree
 * @author Julius Stoerrle
 */
export function GraphDataManager(props: GraphDataManagerProps): JSX.Element {
  const [sharedState, setSharedState] = useState<GraphDataContextProperties>(
    DEFAULT_GRAPH_DATA_CONTEXT
  );
  const { query, selectedObject, dataSource } = sharedState;
  const { dataSource: dataSourceProp, defaultQuery } = props;

  useEffect(() => {
    // When this component is mounted, we first need to hook up the setters in the context
    // In addition values that are not expected to change are stored here
    setSharedState((sharedState) => ({
      ...sharedState,
      // apply the default query only if no other query was set yet
      query: sharedState.query || defaultQuery,
      dataSource: dataSourceProp,
      setQuery: (query: Query) =>
        setSharedState((state) => ({ ...state, query })),
      selectObject: (selectedObject) =>
        setSharedState((state) => ({ ...state, selectedObject })),
      viewCompletedLoading: () =>
        setSharedState((state) =>
          state.status === Status.RENDERING_DATA
            ? { ...state, status: Status.LOADED }
            : state
        ),
      history: {
        storedLocally: LocalStorageQueryHistoryAdapter.gavePermissionToStore(),
        enableLocalStorage: () => {
          setSharedState((state) => {
            LocalStorageQueryHistoryAdapter.enableLocalStorage(
              state.history.queries
            );
            return {
              ...state,
              history: { ...state.history, storedLocally: true },
            };
          });
        },
        disableLocalStorage: () => {
          setSharedState((state) => {
            LocalStorageQueryHistoryAdapter.disableLocalStorage();
            return {
              ...state,
              history: { ...state.history, storedLocally: false },
            };
          });
        },
        queries:
          LocalStorageQueryHistoryAdapter.getStoredHistory() ||
          sharedState.history.queries,
      },
    }));
  }, [setSharedState, dataSourceProp, defaultQuery]);

  useEffect(() => {
    // this code is executed whenever the query object changes
    if (!query || !dataSource) {
      return;
    }
    // we temporarily deselect the node to work around issues if the node is not part of the graph anymore
    let lastSelectedNode = selectedObject;
    setSharedState((state) => ({
      ...state,
      status: Status.NO_REQUEST_MADE,
      selectedObject: null,
      history: {
        ...state.history,
        queries: recordQueryExecution(state.history.queries, query),
      },
    }));
    dataSource
      .getForSparql(query.sparql, (s) => {
        // This state will often be deferred by react, can't do much about it...
        setSharedState((state) => ({
          ...state,
          status:
            s === DataSourceRequestStatus.PROCESSING_DATA
              ? Status.PROCESSING_RESPONSE
              : Status.EXECUTING_QUERY,
        }));
      })
      .then((ds) => {
        if (ds.graph) ds.graph = SetLayout(ds.graph);
        return ds;
      })
      .then((ds) => {
        if (ds.graph && !ds.graph.hasNode(lastSelectedNode)) {
          lastSelectedNode = null;
        }
        setSharedState((state) => ({
          ...state,
          status: Status.RENDERING_DATA,
          selectedObject: lastSelectedNode,
          data: ds,
        }));
      })
      .catch((e) => {
        if (e instanceof HttpError) {
          setSharedState((state) => ({
            ...state,
            error: { message: e.message },
            status: Status.ERROR,
          }));
          return;
        }
        throw e;
      });
  }, [query, dataSource]);

  return (
    <GraphDataContext.Provider value={sharedState}>
      {props.children}
    </GraphDataContext.Provider>
  );
}

export default GraphDataManager;
