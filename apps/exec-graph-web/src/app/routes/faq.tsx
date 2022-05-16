import { Disclosure, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const FAQs = [
  {
    title: 'Who gathered the data?',
    body: 'A team at the Chair of Accounting and Auditing at FAU Erlangen-Nürnberg under the lead of Prof. Dr. Klaus  Henselmann..... In cooperation with the chair the Chair of Information Systems (Prof. Harth) at Friedrich-Alexander University Erlangen-Nürnberg the data was transformed into a Knowledge Graph containing details of each person of interest, such as previous roles and their education.',
  },
  {
    title: 'How was the data gathered?',
    body: '...from social media profiles, Personal/Company websites,... In order to increase the scope of this information, it was then enriched with data from external open graph databases.',
  },
  {
    title: 'Under what license is the data published? Can I use the data?',
    body: (
      <>
        The data is licensed under the{' '}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
          className="fau-link"
        >
          Creative Commons BY-NC-SA 3.0
        </a>{' '}
        license. This means you are free to share or adapt the data as long as
        you do not use the material for commercial purposes, give appropriate
        credit and distribute your work under the same license. Please review
        the linked license for more details or contact us.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-2">
            Please click on a question to discover the answer.
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {FAQs.map((item) => (
            <div className="max-w-3xl p-4 bg-white mb-4">
              <Disclosure>
                <Disclosure.Button className="py-2 font-bold">
                  {item.title}
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="pb-4">
                    {item.body}
                  </Disclosure.Panel>
                </Transition>
              </Disclosure>
            </div>
          ))}

          <div className="max-w-3xl p-4 pb-6 bg-white">
            <h4 className="font-bold py-2">You have a different question?</h4>
            <p>
              Check out the{' '}
              <Link className="fau-link" to="/about">
                About
              </Link>{' '}
              page or contact us at{' '}
              <a href="mailto:wiso-pruefungswesen@fau.de" className="fau-link">
                wiso-pruefungswesen@fau.de
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default FAQ;
