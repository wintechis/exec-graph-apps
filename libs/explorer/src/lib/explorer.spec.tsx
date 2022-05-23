import { render } from '@testing-library/react';

import Explorer from './explorer';

describe('Explorer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Explorer />);
    expect(baseElement).toBeTruthy();
  });
});
