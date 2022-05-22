/* eslint-disable react/jsx-no-target-blank */
// react/jsx-no-target-blank: is not a concern for the links to other FAU pages

/**
 * Top-level React component that renders the 'About' page of the website
 *
 * @category React Component
 */
export function About() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            About this project
          </h1>
          <p className="mt-2">ExecGraph</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="pt-2 pb-4 px-2 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">The idea behind the project</p>
              <h2 className="max-w-3xl font-bold text-xl mb-4">
                Towards a Knowledge Graph capturing Interrelations of
                Executives, Board Members and Auditors in Germany’s DAX 30
                Companies
              </h2>
              <p className="max-w-3xl">
                The bankruptcy of German financial services company Wirecard AG,
                which resulted from accounting irregularities and lack of
                oversight, amplified calls for more extensive financial
                supervision. German laws require members of management boards,
                supervisory boards and auditors to be ‘independent’ from each
                other. However, this only focuses on the current state of
                affairs and does not include long-term relationships. In order
                to capture these aspects, the Chair of Accounting and Auditing
                (Prof. Henselmann) and the Chair of Information Systems (Prof.
                Harth) at Friedrich-Alexander University Erlangen-Nuremberg
                cooperated in creating a Knowledge Graph containing details of
                each person of interest, such as previous roles and their
                education. In order to increase the scope of this information,
                it was then enriched with data from external open graph
                databases. The goal of this project was to analyze
                interrelations between persons of interest and explore Knowledge
                Graphs as a tool in the domain of accounting and auditing.
              </p>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">From the idea until today</p>
              <h2 className="font-bold text-xl mb-4">The Projects History</h2>

              <div className="flex flex-col md:grid grid-cols-9 mx-auto p-2">
                {/*<-- left -->*/}
                <div className="flex flex-row-reverse md:contents">
                  <div className="col-start-1 col-end-5 py-4 md:py-2 px-4 rounded-xl md:ml-auto mr-auto md:mr-0">
                    <span className="text-gray-600 text-sm">2022</span>
                    <h3 className="font-bold mb-1">
                      Publication of this website
                    </h3>
                    <p className="leading-tight text-justify text-sm">
                      With the data now covering DAX 40 this website serves as
                      an opportunity for the public to discover our findings.
                    </p>
                  </div>
                  <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                    <div className="h-full w-6 flex items-center justify-center">
                      <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                  </div>
                </div>
                {/*<-- right -->*/}
                <div className="flex md:contents">
                  <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                    <div className="h-full w-6 flex items-center justify-center">
                      <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                  </div>
                  <div className="col-start-6 col-end-10 py-4 md:py-2 px-4 rounded-xl mr-auto">
                    <span className="text-gray-600 text-sm">2021</span>
                    <h3 className="font-semibold mb-1">Knowledge Graph</h3>
                    <p className="leading-tight text-justify text-sm">
                      For the first time, the data was transfered into an RDF
                      based knowledge graph, visiNav etc....
                    </p>
                  </div>
                </div>
                {/*<-- left -->*/}
                <div className="flex flex-row-reverse md:contents">
                  <div className="col-start-1 col-end-5 py-4 md:py-2 px-4 rounded-xl md:ml-auto mr-auto md:mr-0">
                    <span className="text-gray-600 text-sm">202X</span>
                    <h3 className="font-bold mb-1">Analysis of Wirecard AG</h3>
                    <p className="leading-tight text-justify text-sm">
                      Some Description
                    </p>
                  </div>
                  <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                    <div className="h-full w-6 flex items-center justify-center">
                      <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                  </div>
                </div>
                {/*<-- right -->*/}
                <div className="flex md:contents">
                  <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                    <div className="h-full w-6 flex items-center justify-center">
                      <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                  </div>
                  <div className="col-start-6 col-end-10 py-4 md:py-2 px-4 rounded-xl mr-auto">
                    <span className="text-gray-600 text-sm">20XX</span>
                    <h3 className="font-semibold mb-1">Publication Y</h3>
                    <p className="leading-tight text-justify text-sm">xxxx</p>
                  </div>
                </div>
                {/*<-- left -->*/}
                <div className="flex flex-row-reverse md:contents">
                  <div className="col-start-1 col-end-5 py-4 md:py-2 px-4 rounded-xl md:ml-auto mr-auto md:mr-0">
                    <span className="text-gray-600 text-sm">20XX</span>
                    <h3 className="font-bold mb-1">
                      Project Idea / Data Collection
                    </h3>
                    <p className="leading-tight text-justify text-sm">
                      The project started
                    </p>
                  </div>
                  <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                    <div className="h-full w-6 flex items-center justify-center">
                      <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">Contact</p>
              <h2 className="font-bold text-xl mb-4">
                The Team Behind the Project
              </h2>
              <p className="max-w-3xl">
                The project is backed by researchers from the{' '}
                <a
                  href="https://www.fau.eu/"
                  target="_blank"
                  className="fau-link"
                >
                  Friedrich Alexander Universität Erlangen-Nürnberg
                </a>
                . It is lead by the Chair of Accounting and Auditing for data
                collection and analysis, and supported by the Chair of Technical
                Information Systems for the creation of the knowledge graph and
                visualisation.
              </p>
              <h3 className="mt-4 font-bold">
                Chair of Accounting and Auditing
              </h3>
              <div>
                <a
                  href="https://www.pw.rw.fau.de/"
                  target="_blank"
                  className="fau-link"
                >
                  Website
                </a>{' '}
                |{' '}
                <a
                  href="mailto:wiso-pruefungswesen@fau.de"
                  className="fau-link"
                >
                  Email
                </a>
              </div>
              <div className="mt-2">
                Prof. Henselmann + Julian Grümmer + more? [List people,
                function+picures]
              </div>
              <h3 className="mt-4 font-bold">
                Chair of Technical Information Systems
              </h3>
              <div>
                <a
                  href="https://www.ti.rw.fau.de/"
                  target="_blank"
                  className="fau-link"
                  rel="noreferrer"
                >
                  Website
                </a>
              </div>
              <div className="mt-2">
                Prof. Harth + others? (+ maybe us) [List people,
                function+picures]
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default About;
