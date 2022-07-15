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
    body: 'A team at the Chair of Accounting and Auditing at FAU Erlangen-Nürnberg under the lead of Prof. Dr. Klaus  Henselmann. In cooperation with the chair the Chair of Information Systems (Prof. Harth) at Friedrich-Alexander University Erlangen-Nürnberg the data was transformed into a Knowledge Graph containing details of each person of interest, such as previous roles and their education.',
  },
  {
    title: 'How was the data gathered?',
    body: 'The data was collected from social media profiles, personal or company websites and public databases. In order to increase the scope of this information, it was then enriched with data from external open graph databases, like WikiData.',
  },
  {
    title: 'What can be done with the graph?',
    body: 'The graph is intended to show the relationships between the various institutions and relevant persons of the DAX30 companies and to provide a better understanding of the interdependencies between them. For example, the graph was used to investigate the Wirecard scandal in order to take a closer look at the people behind the company, in particular the members of the management board and the supervisory board.',
  },
  {
    title: 'Why was the data aggregated into a Knowledge Graph?',
    body: 'The data is directly networked, stored and processed. This structure makes it possible to avoid complex queries such as recursively nested joins and this leads to an efficient traversal. Due to the efficient traversing, the performance is much higher than that of a rela-tional database. ',
  },
  {
    title: "What's next for the project?",
    body: 'The graph currently contains, among others, the data of the DAX30 companies. Since September 2021, the DAX has been expanded to a total of 40 companies. Work is currently being done to include the newly added companies in the DAX40. In the context of the German Supply Chain Act, which will come into force in January 2023, special focus will also be given to the suppliers of the companies.',
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
