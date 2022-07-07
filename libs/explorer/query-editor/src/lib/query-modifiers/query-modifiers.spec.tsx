import { render } from '@testing-library/react';

import QueryModifiers from './query-modifiers';
import { Modifiers } from './query.types';

describe('QueryModifiers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <QueryModifiers
        modifiers={{
          limit: 20,
          offset: 50,
          orderBy: '?s',
          orderByDir: 'ASCENDING',
        }}
        onChange={function (modifiers: Modifiers): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
