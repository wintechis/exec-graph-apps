import { render } from '@testing-library/react';

import QueryLibrary from './query-library';

describe('QueryLibrary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryLibrary />);
    expect(baseElement).toBeTruthy();
  });
});
