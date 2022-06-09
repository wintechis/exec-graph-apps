import { render } from '@testing-library/react';

import FormEditor from './form-editor';

describe('FormEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormEditor />);
    expect(baseElement).toBeTruthy();
  });
});
