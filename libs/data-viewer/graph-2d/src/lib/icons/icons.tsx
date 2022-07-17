import college from '../icons/CollegeOrUniversity.svg';
import organization from '../icons/Organization.svg';
import city from '../icons/City.svg';
import questionmark from '../icons/QuestionMark.svg';
import person from '../icons/Person.svg';

export const icons = {
  nodes: {
    City: { image: city, color: '#000066', label: 'City' },
    Person: { image: person, color: '#006600', label: 'Person' },
    Organization: {
      image: organization,
      color: '#660000',
      label: 'Organization',
    },
    CollegeOrUniversity: {
      image: college,
      color: '#b3b300',
      label: 'College or university',
    },
    Others: { image: questionmark, color: '#666666', label: 'Others' },
  },
  edges: {
    birthPlaceConnection: { color: '#9999ff', type: 'Place Connection' },
    birthPlaceOf: { color: '#9999ff', type: 'Place Connection' },
    birthPlace: { color: '#9999ff', type: 'Place Connection' },
    smarterThan: { color: '#99ff99', type: 'Person Connection' },
    knows: { color: '#99ff99', type: 'Person Connection' },
    sourceOrganization: { color: '#ff9999', type: 'Work Connection' },
    workConnection: { color: '#ff9999', type: 'Work Connection' },
    dealingWith: { color: '#ff9999', type: 'Work Connection' },
    hasDealing: { color: '#ff9999', type: 'Work Connection' },
    currentCEO: { color: '#ff9999', type: 'Work Connection' },
    isCEO: { color: '#ff9999', type: 'Work Connection' },
    isOnSupervisoryBoardOf: { color: '#ff9999', type: 'Work Connection' },
    isOnManagementBoardOf: { color: '#ff9999', type: 'Work Connection' },
    currentEmployee: { color: '#ff9999', type: 'Work Connection' },
    employedInPast: { color: '#ff9999', type: 'Work Connection' },
    currentlyWorksAt: { color: '#ff9999', type: 'Work Connection' },
    hasWorkConnection: { color: '#ff9999', type: 'Work Connection' },
    hasRole: { color: '#ff9999', type: 'Work Connection' },
    pastRolesAt: { color: '#ff9999', type: 'Work Connection' },
    currentManagementBoard: { color: '#ff9999', type: 'Work Connection' },
    currentSupervisoryBoard: { color: '#ff9999', type: 'Work Connection' },
    roleWith: { color: '#ff9999', type: 'Work Connection' },
    hasAudit: { color: '#ff99ff', type: 'Audit Connection' },
    audited: { color: '#ff99ff', type: 'Audit Connection' },
    auditedBy: { color: '#ff99ff', type: 'Audit Connection' },
    educationConnection: { color: '#ffff99', type: 'Education Connection' },
    hasEducationConnection: { color: '#ffff99', type: 'Education Connection' },
    studiedAt: { color: '#ffff99', type: 'Education Connection' },
    educatedAt: { color: '#ffff99', type: 'Education Connection' },
    hasAlumni: { color: '#ffff99', type: 'Education Connection' },
    alumniOf: { color: '#ffff99', type: 'Education Connection' },
    author: { color: '#ffff99', type: 'Education Connection' },
  },
};
