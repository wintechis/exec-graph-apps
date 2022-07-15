import { render } from '@testing-library/react';

import SparqlInput from './sparql-input';

describe('SparqlInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SparqlInput />);
    expect(baseElement).toBeTruthy();
  });
});
