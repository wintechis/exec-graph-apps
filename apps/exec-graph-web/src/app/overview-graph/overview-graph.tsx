import { RemoteDataSource } from '@exec-graph/graph/data-source-remote';
import { DataSet } from '@exec-graph/graph/types';
import { RefreshIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { useState, useEffect, lazy } from 'react';
import { SetLayout } from './overview-graph-view/utils/overviewLayoutController';

import backgroundImg from '../../assets/ExampleGraph.png';

const OverviewGraphView = lazy(
  () => import('./overview-graph-view/overview-graph-view')
);

const OVERVIEW_QUERY = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {?s ?p1 ?l. ?s ?p2 ?o.}
WHERE {
    ?s ?p1 ?l.
    ?s ?p2 ?o.
    ?s rdf:type ?cS.
    ?o rdf:type ?cO.
    FILTER (?cS IN ( schema:City, schema:Person, schema:Organization, schema:CollegeOrUniversity ) )
    FILTER (?oO IN ( schema:City, schema:Person, schema:Organization, schema:CollegeOrUniversity ) )
    FILTER (?p1 IN ( rdf:type, rdfs:label ))
}`;

/**
 * Type definition of mandatory and optional properties of the {@link OverviewGraph} component
 */
export interface OverviewGraphProps {
  dataSource: RemoteDataSource;
}

/**
 * Graph to schow case the content of the ExecGraph on the overview page
 *
 * @category React Component
 */
export function OverviewGraph(props: OverviewGraphProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<DataSet | null>(null);

  useEffect(() => {
    props.dataSource
      .getForSparql(OVERVIEW_QUERY)
      .then((ds) => {
        if (ds.graph) ds.graph = SetLayout(ds.graph);
        return ds;
      })
      .then((result) => {
        setIsLoaded(true);
        setData(result);
      })
      .catch((e) => {
        setIsLoaded(true);
        setError(error);
      });
  }, [error, props.dataSource]);

  /**
   * Creates an inline notification template
   *
   * @returns inline notification container
   */
  function inlineNotification(content: JSX.Element): JSX.Element {
    return (
      <div
        style={{
          background: 'url(' + backgroundImg + ')',
        }}
      >
        <div className="px-4 py-6 pb-12 max-w-5xl mx-auto">
          <div className="bg-white h-48 p-6 max-w-4xl">{content}</div>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div>
        <OverviewGraphView data={data}></OverviewGraphView>
      </div>
    );
  } else if (error) {
    return inlineNotification(
      <>
        <ExclamationCircleIcon className="text-fau-red h-6 w-6"></ExclamationCircleIcon>
        <h3 className="mt-4 text-2xl text-fau-red font-bold">Error</h3>
        <div className="max-w-prose">
          Sorry, we have encountered an issue while loading the ExecGraph data.
        </div>
        <pre className="max-w-prose mt-4">{error.message}</pre>
      </>
    );
  } else if (!isLoaded) {
    return inlineNotification(
      <>
        <RefreshIcon className="animate-spin h-6 w-6"></RefreshIcon>
        <h3 className="mt-4 text-2xl font-bold">Loading</h3>
        <div className="max-w-prose">The ExecGraph data is being loaded.</div>
      </>
    );
  }
  return inlineNotification(
    <>
      <ExclamationCircleIcon className="text-fau-red h-6 w-6"></ExclamationCircleIcon>
      <h3 className="mt-4 text-2xl text-fau-red font-bold">Error</h3>
      <div className="max-w-prose">
        Sorry, we have encountered an issue with displaying the graph
      </div>
    </>
  );
}

export default OverviewGraph;
