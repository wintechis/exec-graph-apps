import { render } from '@testing-library/react';

import SparqlEditor from './sparql-editor';

describe('SparqlEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SparqlEditor />);
    expect(baseElement).toBeTruthy();
  });
});
