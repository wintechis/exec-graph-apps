import { render } from '@testing-library/react';

import DialogErrorBoundary from './dialog-error-boundary';

describe('DialogErrorBoundary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogErrorBoundary />);
    expect(baseElement).toBeTruthy();
  });
});
