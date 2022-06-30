import person from './Person.svg';
import college from '../icons/CollegeOrUniversity.svg';
import organization from '../icons/Organization.svg';
import city from '../icons/City.svg';
import questionmark from '../icons/QuestionMark.svg';

export const icons = {
  nodes: {
    City: { image: city, color: '#000066' },
    Person: { image: person, color: '#006600' },
    Organization: { image: organization, color: '#660000' },
    CollegeOrUniversity: { image: college, color: '#666600' },
    QuestionMark: { image: questionmark, color: '#666666' },
  },
  edges: {
    birthPlaceConnection: '#9999ff',
    birthPlaceOf: '#9999ff',
    birthPlace: '#9999ff',
    smarterThan: '#99ff99',
    knows: '#99ff99',
    workConnection: '#ff9999',
    dealingWith: '#ff9999',
    hasDealing: '#ff9999',
    hasAudit: '#ff9999',
    audited: '#ff9999',
    currentCEO: '#ff9999',
    isCEO: '#ff9999',
    auditedBy: '#ff9999',
    isOnSupervisoryBoardOf: '#ff9999',
    isOnManagementBoardOf: '#ff9999',
    currentEmployee: '#ff9999',
    employedInPast: '#ff9999',
    currentlyWorksAt: '#ff9999',
    hasWorkConnection: '#ff9999',
    hasRole: '#ff9999',
    pastRolesAt: '#ff9999',
    currentManagementBoard: '#ff9999',
    currentSupervisoryBoard: '#ff9999',
    roleWith: '#ff9999',
    educationConnection: '#ffff99',
    studiedAt: '#ffff99',
    educatedAt: '#ffff99',
    hasAlumni: '#ffff99',
    author: '#ffff99',
  },
};
