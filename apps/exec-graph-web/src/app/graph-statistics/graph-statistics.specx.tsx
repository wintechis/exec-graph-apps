import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import { DataSource } from '@exec-graph/graph/types';
import { render, waitFor, screen } from '@testing-library/react';

import GraphStatistics from './graph-statistics';

describe('GraphStatistics', () => {
  it('should render successfully', async () => {
    const mockDataSource: DataSource = {
      getForSparql: jest.fn(() =>
        Promise.resolve({
          tabular: JSON.parse(
            '{"headers":["class","numberOfInstances"],"data":[{"class":{"type":"uri","value":"http://schema.org/EmployeeRole"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"5107"}},{"class":{"type":"uri","value":"http://schema.org/Organization"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"1211"}},{"class":{"type":"uri","value":"http://schema.org/EducationalOccupationalProgram"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"1128"}},{"class":{"type":"uri","value":"http://schema.org/Person"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"759"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#SupervisoryBoardMember"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"498"}},{"class":{"type":"uri","value":"http://schema.org/TradeAction"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"354"}},{"class":{"type":"uri","value":"http://schema.org/CollegeOrUniversity"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"338"}},{"class":{"type":"uri","value":"http://schema.org/City"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"291"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#ManagementBoardMember"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"212"}},{"class":{"type":"uri","value":"http://schema.org/Review"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"148"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#Auditor"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"86"}},{"class":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"71"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#CEO"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"31"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#DAXmember"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"30"}},{"class":{"type":"uri","value":"http://www.w3.org/2002/07/owl#SymmetricProperty"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"4"}},{"class":{"type":"uri","value":"http://www.w3.org/2002/07/owl#TransitiveProperty"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"4"}},{"class":{"type":"uri","value":"https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#AuditCompany"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"4"}},{"class":{"type":"uri","value":"http://www.w3.org/2000/01/rdf-schema#Class"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"3"}},{"class":{"type":"uri","value":"http://www.w3.org/2000/01/rdf-schema#Datatype"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"3"}},{"class":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#List"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"1"}},{"class":{"type":"uri","value":"http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty"},"numberOfInstances":{"datatype":"http://www.w3.org/2001/XMLSchema#integer","type":"literal","value":"1"}}]}'
          ),
          schema: DEFAULT_SCHEMA,
        })
      ),
      getAll: jest.fn(),
    };
    const { asFragment } = render(
      <GraphStatistics dataSource={mockDataSource} />
    );
    await waitFor(() => screen.getByText('759', { exact: false }));
    expect(asFragment()).toMatchSnapshot();
  });
});
