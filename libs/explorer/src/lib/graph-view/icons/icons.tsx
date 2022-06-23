import person from './Person.svg';
import college from '../icons/CollegeOrUniversity.svg';
import organization from '../icons/Organization.svg';
import city from '../icons/City.svg';
import questionmark from '../icons/QuestionMark.svg';

export const icons = {
  nodes: {
    City: { image: city, color: 'blue' },
    CollegeOrUniversity: { image: college, color: 'yellow' },
    Organization: { image: organization, color: 'red' },
    Person: { image: person, color: 'green' },
    QuestionMark: { image: questionmark, color: 'grey' },
  },
  // edges: {
  //   educationConnection: 'CollegeOrUniversity',
  //   studiedAt: 'CollegeOrUniversity',
  //   educatedAt: 'CollegeOrUniversity',
  //   workConnection: 'Organization',
  //   dealingWith: 'Organization',
  //   hasDealing: 'Organization',
  //   hasAudit: 'Organization',
  //   audited: 'Organization',
  //   currentCEO: 'Organization',
  //   isCEO: 'Organization',
  //   auditedBy: 'Organization',
  //   isOnSupervisoryBoardOf: 'Organization',
  //   isOnManagementBoardOf: 'Organization',
  //   currentEmployee: 'Organization',
  //   employedInPast: 'Organization',
  //   currentlyWorksAt: 'Organization',
  //   hasWorkConnection: 'Organization',
  //   hasAlumni: 'Organization',
  //   hasRole: 'Organization',
  //   pastRolesAt: 'Organization',
  //   currentManagementBoard: 'Organization',
  //   currentSupervisoryBoard: 'Organization',
  //   roleWith: 'Organization',
  //   birthPlaceConnection: 'City',
  //   birthPlaceOf: 'City',
  //   birthPlace: 'City',
  //   author: 'Person',
  //   smarterThan: 'Person',
  //   knows: 'Person',
  // },
};
