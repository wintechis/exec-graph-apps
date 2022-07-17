import { render } from '@testing-library/react';

import QueryHistory from './query-history';

describe('QueryHistory', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <QueryHistory
        history={[]}
        localStorageEnabled={true}
        onSelect={function (sparql: string): void {
          throw new Error('Function not implemented.');
        }}
        toggleLocalStorage={function (enabled: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
