/* eslint-disable react/jsx-no-target-blank */
// react/jsx-no-target-blank: is not a concern for the links to other FAU pages

import { INTORDUCTION, TIMELINE, CONTACT } from '../../contents/about';

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
              <p className="text-gray-600">{INTORDUCTION.subheading}</p>
              <h2 className="max-w-3xl font-bold text-xl mb-4">
                {INTORDUCTION.heading}
              </h2>
              <p className="max-w-3xl">{INTORDUCTION.text}</p>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">{TIMELINE.subheading}</p>
              <h2 className="font-bold text-xl mb-4">{TIMELINE.heading}</h2>

              <div className="flex flex-col md:grid grid-cols-9 mx-auto p-2">
                {TIMELINE.steps.map((step, index) => (
                  <>
                    {index % 2 === 0 && (
                      <div
                        key={step.title}
                        className="flex md:contents flex-row-reverse"
                      >
                        <div className="col-start-1 col-end-5 py-4 md:py-2 px-4 rounded-xl md:ml-auto mr-auto md:mr-0">
                          <span className="text-gray-600 text-sm">
                            {step.date}
                          </span>
                          <h3 className="font-bold mb-1">{step.title}</h3>
                          <p className="leading-tight text-justify text-sm">
                            {step.description}
                          </p>
                        </div>
                        <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                          <div className="h-full w-6 flex items-center justify-center">
                            <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                          </div>
                          <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                        </div>
                      </div>
                    )}
                    {index % 2 !== 0 && (
                      <div key={step.title} className="flex md:contents">
                        <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                          <div className="h-full w-6 flex items-center justify-center">
                            <div className="h-full w-1 bg-gray-500 pointer-events-none"></div>
                          </div>
                          <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-fau-red shadow"></div>
                        </div>
                        <div className="col-start-6 col-end-10 py-4 md:py-2 px-4 rounded-xl mr-auto">
                          <span className="text-gray-600 text-sm">
                            {step.date}
                          </span>
                          <h3 className="font-bold mb-1">{step.title}</h3>
                          <p className="leading-tight text-justify text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-0">
            <div className="bg-white p-8">
              <p className="text-gray-600">{CONTACT.subheading}</p>
              <h2 className="font-bold text-xl mb-4">{CONTACT.heading}</h2>
              <p className="max-w-3xl">{CONTACT.description}</p>
              <div className="flex flex-wrap">
                {CONTACT.chairs.map((p) => (
                  <div className="mr-8" key={p.chairName}>
                    <h3 className="mt-4 font-bold">{p.chairName}</h3>
                    <div>
                      <a
                        href={p.chairWebsite}
                        target="_blank"
                        className="fau-link"
                      >
                        Website
                      </a>{' '}
                      {p.chairEmail && (
                        <>
                          |{' '}
                          <a href={p.chairEmail} className="fau-link">
                            Email
                          </a>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap">
                      {p.people.map((person) => (
                        <div className="mr-4 w-36" key={person.name}>
                          <img
                            src={person.imgPath}
                            alt={person.name}
                            className="object-cover w-36 h-44"
                          />
                          <div className="text-sm font-bold mt-1">
                            {person.name}
                          </div>
                          {person.position && (
                            <div className="text-gray-600 text-sm">
                              {person.position}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default About;
