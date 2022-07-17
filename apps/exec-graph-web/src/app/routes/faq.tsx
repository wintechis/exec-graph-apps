import { Disclosure, Transition } from '@headlessui/react';
import { HiOutlineChevronRight, HiOutlineChevronDown } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { FAQS } from '../../contents/faq';

/**
 * Top-level React component that renders the 'FAQ' page of the website
 *
 * @category React Component
 */
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
          {FAQS.map((item) => (
            <div className="max-w-3xl p-4 bg-white mb-4">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="py-2 font-bold flex">
                      {!open && (
                        <HiOutlineChevronRight className="w-5 h-5 mr-4 self-center" />
                      )}
                      {open && (
                        <HiOutlineChevronDown className="w-5 h-5 mr-4 self-center" />
                      )}{' '}
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
                  </>
                )}
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
