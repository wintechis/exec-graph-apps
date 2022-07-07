import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import { DataSource } from '@exec-graph/graph/types';
import { render } from '@testing-library/react';

import QueryEditor from './query-editor';

describe('QueryEditor', () => {
  it('should render successfully', () => {
    const dataSource: DataSource = {
      getForSparql: jest.fn(() =>
        Promise.resolve({
          schema: DEFAULT_SCHEMA,
          tabular: { data: [], headers: [] },
        })
      ),
      addInformation: jest.fn(),
      getAll: jest.fn(),
    };
    const { baseElement } = render(
      <QueryEditor
        dataSource={dataSource}
        sparql={''}
        onSubmit={function (sparql: string): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
