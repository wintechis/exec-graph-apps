import { render } from '@testing-library/react';

import DetailView from './detail-view';

describe('DetailView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DetailView />);
    expect(baseElement).toBeTruthy();
  });
});
