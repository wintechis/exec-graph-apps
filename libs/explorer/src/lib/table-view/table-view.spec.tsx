import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import { DataSet } from '@exec-graph/graph/types';
import { render } from '@testing-library/react';

import TableView from './table-view';

describe('TableView', () => {
  it('should render successfully', () => {
    const data: DataSet = {
      schema: DEFAULT_SCHEMA,
      tabular: {
        headers: ['colA', 'colB'],
        data: [
          {
            colA: { value: 'A1', type: 'literal' },
            colB: { value: 'colB', type: 'literal' },
          },
        ],
      },
    };
    const { baseElement } = render(<TableView data={data} />);
    expect(baseElement).toBeTruthy();
  });
});
