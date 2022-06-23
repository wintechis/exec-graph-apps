/**
 * This file defines the textual content of the about page
 * without all the structural markup to allow for easier
 * editing.
 */
/* eslint-disable react/jsx-no-target-blank */
// react/jsx-no-target-blank: is not a concern for the links to other FAU pages

/**
 * Content of the first section on the about page to introduce the project.
 */
export const INTORDUCTION = {
  subheading: 'The idea behind the project',
  heading:
    'Towards a Knowledge Graph capturing Interrelations of Executives, Board Members and Auditors in Germany’s DAX 40 Companies',
  text: `The bankruptcy of German financial services company Wirecard AG,
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
    Graphs as a tool in the domain of accounting and auditing.`,
};

/**
 * Content of timeline section
 */
export const TIMELINE = {
  subheading: 'From the idea until today',
  heading: 'The Projects History',
  steps: [
    {
      date: '2022',
      title: 'Publication of this website',
      description:
        'With the data now covering DAX 40 this website serves as an opportunity for the public to discover our findings.',
    },
    {
      date: '2021',
      title: 'Knowledge Graph',
      description:
        'For the first time, the data was transfered into an RDF based knowledge graph, visiNav etc...',
    },
    {
      date: '202X',
      title: 'Analysis of Wirecard AG',
      description: 'Some Description',
    },
    {
      date: '20XX',
      title: 'Publication XX',
      description: 'xxx.',
    },
    {
      date: '20XX',
      title: 'Project Idea / Data Collection',
      description: 'The project started',
    },
  ],
};

/**
 * Contact / project team information
 */
export const CONTACT = {
  subheading: 'Contact',
  heading: 'The Team Behind the Project',
  description: (
    <>
      The project is backed by researchers from the{' '}
      <a href="https://www.fau.eu/" target="_blank" className="fau-link">
        Friedrich Alexander Universität Erlangen-Nürnberg
      </a>
      . It is lead by the Chair of Accounting and Auditing for data collection
      and analysis, and supported by the Chair of Technical Information Systems
      for the creation of the knowledge graph and visualisation.
    </>
  ),
  chairs: [
    {
      chairName: 'Chair of Accounting and Auditing',
      chairWebsite: 'https://www.pw.rw.fau.de/',
      chairEmail: 'mailto:wiso-pruefungswesen@fau.de',
      people: [
        {
          imgPath: '../assets/people/HenselmannKlaus.jpg',
          name: 'Univ.-Prof. Dr. Klaus Henselmann',
          position: null,
        },
        {
          imgPath: '../assets/people/GruemmerJulian.png',
          name: 'Julian Grümmer, M.Sc',
          position: 'Research Assistant',
        },
      ],
    },
    {
      chairName: 'Chair of Technical Information Systems',
      chairWebsite: 'https://www.ti.rw.fau.de/',
      people: [
        {
          imgPath: '../assets/people/HarthAndreas.jpg',
          name: 'Prof. Dr. Andreas Harth',
          position: null,
        },
        {
          imgPath: '../assets/people/GruemmerJulian.png',
          name: 'Albin Lokaj, B.Sc.',
          position: 'Developer',
        },
        {
          imgPath: '../assets/people/GruemmerJulian.png',
          name: 'Julius Störrle, B.Sc.',
          position: 'Developer',
        },
      ],
    },
  ],
};
