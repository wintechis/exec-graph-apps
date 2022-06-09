import { render } from '@testing-library/react';

import FilterEditor from './filter-editor';

describe('FilterEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FilterEditor />);
    expect(baseElement).toBeTruthy();
  });
});
