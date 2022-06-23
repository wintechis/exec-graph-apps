import { RemoteDataSource } from '@exec-graph/graph/data-source-remote';
import { DataSet } from '@exec-graph/graph/types';
import { useState, useEffect } from 'react';

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
export function OverviewGraph(props: OverviewGraphProps): JSX.Element {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<DataSet | null>(null);

  useEffect(() => {
    props.dataSource.getForSparql(OVERVIEW_QUERY).then(
      (result) => {
        setIsLoaded(true);
        setData(result);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  if (data) {
    const graph = data?.graph;
    return (<div>{/* Replace with your content */}
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-gray-400 text-bold p-8">
        A high level graph with minimal interaction
      </div>
    </div>
    {/* /End replace */}</div>);
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return <div>Unknown Status</div>;
}

export default OverviewGraph;
