import {
  RemoteDataSource,
  HttpClient,
  FetchHttpClient,
  HttpSparqlRepository,
} from '@exec-graph/graph/data-source-remote';
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
} from '@heroicons/react/outline';
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
          <div className="py-6 sm:px-6 lg:px-8">
            <OverviewGraph dataSource={this.dataSource} />
          </div>
          <div className="py-6 sm:px-6 lg:px-8 bg-white shadow-sm">
            <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">The Numbers</h2>
              </div>
              <GraphStatistics dataSource={this.dataSource}></GraphStatistics>
            </div>
          </div>
          <div className="py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 gap-8 xl:gap-12 sm:grid-cols-3">
                <a
                  className="block bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link w-full"
                  href="./about"
                >
                  <ChevronRightIcon className="w-6 h-6 mb-2"></ChevronRightIcon>
                  Learn more about the project
                </a>
                <a
                  className="bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link"
                  href="./about"
                >
                  <ShareIcon className="w-6 h-6 mb-2"></ShareIcon>
                  Explore the graph
                </a>
                <a
                  className="bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link"
                  href="./about"
                >
                  <QuestionMarkCircleIcon className="w-6 h-6 mb-2"></QuestionMarkCircleIcon>
                  Check the FAQs
                </a>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Overview;
