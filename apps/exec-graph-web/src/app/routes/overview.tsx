import {
  RemoteDataSource,
  HttpClient,
  FetchHttpClient,
  HttpSparqlRepository,
} from '@exec-graph/graph/data-source-remote';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import GraphStatistics from '../graph-statistics/graph-statistics';
import OverviewGraph from '../overview-graph/overview-graph';

interface OverviewProps {
  /** URL pointing to a remote SPARQL dndpoint */
  sparqlEndpoint: string;
}

/**
 * Top-level React component that renders the 'Overview' page of the website
 *
 * @category React Component
 */
export class Overview extends Component<OverviewProps> {
  private dataSource: RemoteDataSource;

  constructor(props: OverviewProps) {
    super(props);
    const httpClient: HttpClient = new FetchHttpClient();
    const sparqlRepository = new HttpSparqlRepository(
      props.sparqlEndpoint,
      httpClient
    );
    this.dataSource = new RemoteDataSource(sparqlRepository);
  }

  public override render() {
    return (
      <>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl text-white bg-fau-red p-1 inline">
                ExecGraph
              </h1>
            </div>
            <div className="mt-8 text-white bg-fau-red p-1 inline-block">
              A project by the Chair of Accounting and Auditing at FAU
              Erlangen-Nürnberg.
            </div>
            <div className="mt-12 text-gray-800">
              Visualisation of work connections of DAX management board members,
              supervisory board members, and auditors.
            </div>
            <div className="mt-6 text-gray-800">
              Scroll down for some highlights or{' '}
              <Link to="/explore" className="fau-link">
                explore the graph
              </Link>{' '}
              on your own.
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <OverviewGraph dataSource={this.dataSource} />
          </div>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-white">
            <div className="px-4 py-6 sm:px-0 bg-white">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">The Numbers</h2>
              </div>
              <GraphStatistics dataSource={this.dataSource}></GraphStatistics>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Overview;
