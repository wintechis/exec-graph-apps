import { RemoteDataSource } from '@exec-graph/graph/data-source-remote';
import { DataSet } from '@exec-graph/graph/types';
import { useState, useEffect } from 'react';
import { MemoizedOverviewGraph } from './overview-graph-view/overview-graph-view';
import { SetLayout } from './overview-graph-view/utils/overviewLayoutController';

const OVERVIEW_QUERY = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>

CONSTRUCT {?s ?p ?o}
WHERE {
    ?s ?p ?o.
    ?s rdf:type ?c.
    FILTER (?c IN ( schema:City, schema:Person, schema:Organization, schema:CollegeOrUniversity ) )
}`;

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

  if (data) {
    return (
      <div>
        <MemoizedOverviewGraph data={data}></MemoizedOverviewGraph>
      </div>
    );
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-gray-800">
        Loading...
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-gray-800">
      Unknown Status
    </div>
  );
}

export default OverviewGraph;
