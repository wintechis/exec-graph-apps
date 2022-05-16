import { AdjustmentsIcon } from '@heroicons/react/outline';

export function Explore() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="flex max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <div className="hidden md:block ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="-1 rounded-full text-gray-800 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Adjust graph design</span>
                <AdjustmentsIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 text-center text-gray-400 text-bold p-8">
              Insert interactive graph here
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </>
  );
}

export default Explore;
