import { render } from '@testing-library/react';

import TableView from './table-view';

describe('TableView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableView />);
    expect(baseElement).toBeTruthy();
  });
});
