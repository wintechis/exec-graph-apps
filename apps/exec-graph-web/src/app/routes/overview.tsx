import { Link } from 'react-router-dom';

/**
 * Top-level React component that renders the 'Overview' page of the website
 *
 * @category React Component
 */
export function Overview() {
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
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-gray-400 text-bold p-8">
              A high level graph with minimal interaction
            </div>
          </div>
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-gray-400 text-bold p-8">
              Some statistics on the dataset (number of people, connections,
              companies etc.)
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </>
  );
}

export default Overview;
