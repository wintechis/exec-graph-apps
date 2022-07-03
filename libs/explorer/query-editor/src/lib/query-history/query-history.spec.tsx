import { render } from '@testing-library/react';

import QueryHistory from './query-history';

describe('QueryHistory', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryHistory />);
    expect(baseElement).toBeTruthy();
  });
});
