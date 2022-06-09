import { render } from '@testing-library/react';

import QueryModifiers from './query-modifiers';

describe('QueryModifiers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryModifiers />);
    expect(baseElement).toBeTruthy();
  });
});
