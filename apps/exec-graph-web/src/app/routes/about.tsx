import { Disclosure } from '@headlessui/react';

export function About() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            About this project
          </h1>
          <p className="mt-2">xxxx</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with actual content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">Project idea / background / abstract</p>

              <h2 className='font-bold text-xl mb-4'>Towards a Knowledge Graph capturing Interrelations of Executives, Board Members and Auditors in Germany’s DAX 30 Companies</h2>
              <p>The bankruptcy of German financial services company Wirecard AG, which resulted from accounting irregularities and lack of oversight, amplified calls for more extensive financial supervision. German laws require members of management boards, supervisory boards and auditors to be ‘independent’ from each other. However, this only focuses on the current state of affairs and does not include long-term relationships. In order to capture these aspects, the Chair of Accounting and Auditing (Prof. Henselmann) and the Chair of Information Systems (Prof. Harth) at Friedrich-Alexander University Erlangen-Nuremberg cooperated in creating a Knowledge Graph containing details of each person of interest, such as previous roles and their education. In order to increase the scope of this information, it was then enriched with data from external open graph databases. The goal of this project was to analyze interrelations between persons of interest and explore Knowledge Graphs as a tool in the domain of accounting and auditing.</p>

            </div>
          </div>
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-80 text-center text-gray-400 text-bold p-8">
              Project history (Publications?)
            </div>
          </div>
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-40 text-center text-gray-400 text-bold p-8">
              Contact / Link to chair website
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </>
  );
}

export default About;
