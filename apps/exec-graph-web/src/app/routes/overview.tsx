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
import { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import GraphStatistics from '../graph-statistics/graph-statistics';

/**
 * Increase time to interactive of the overall page by deferring the graph
 */
const OverviewGraph = lazy(() => import('../overview-graph/overview-graph'));

/**
 * Type definition of mandatory and optional properties of the {@link Overview} component
 */
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

  /**
   * Renders the overview page
   */
  public override render(): JSX.Element {
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
          <Suspense
            fallback={
              <div className="h-48 flex items-center justify-center"></div>
            }
          >
            <OverviewGraph dataSource={this.dataSource} />
          </Suspense>
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
                <Link
                  to="/about"
                  className="bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link"
                >
                  <ChevronRightIcon className="w-6 h-6 mb-2"></ChevronRightIcon>
                  Learn more about the project
                </Link>
                <Link
                  to="/explore"
                  className="bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link"
                >
                  <ShareIcon className="w-6 h-6 mb-2"></ShareIcon>
                  Explore the graph
                </Link>
                <Link
                  to="/faq"
                  className="bg-white p-4 pt-8 font-bold rounded shadow-sm fau-link"
                >
                  <QuestionMarkCircleIcon className="w-6 h-6 mb-2"></QuestionMarkCircleIcon>
                  Check the FAQs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Overview;
