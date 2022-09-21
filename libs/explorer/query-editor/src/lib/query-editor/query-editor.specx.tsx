import { DEFAULT_SCHEMA } from '@exec-graph/graph/data-source';
import { DataSource } from '@exec-graph/graph/types';
import { render } from '@testing-library/react';
import {
  ExecutedQuery,
  QueryHistoryService,
} from '../query-history/query-history.service';

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
    const mockHistoryService: QueryHistoryService = {
      gavePermissionToStore: function (): boolean {
        return true;
      },
      enableLocalStorage: () => null,
      disableLocalStorage: () => null,
      recordExecution: () => null,
      getHistory: function (): ExecutedQuery[] {
        return [];
      },
      setHistory: function (history: ExecutedQuery[]): void {
        return;
      },
    };

    const { baseElement } = render(
      <QueryEditor
        historyService={mockHistoryService}
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
