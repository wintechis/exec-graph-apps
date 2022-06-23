/**
 * This file defines the textual content of the FAQ page
 * without all the structural markup to allow for easier
 * editing.
 */

/**
 * Ordered list of all FAQ items to be rendered on the FAQ page.
 * This is the place to change, add or remove entries from the page.
 */
export const FAQS = [
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
