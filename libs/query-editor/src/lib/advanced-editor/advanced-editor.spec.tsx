import { render } from '@testing-library/react';

import AdvancedEditor from './advanced-editor';

describe('AdvancedEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdvancedEditor />);
    expect(baseElement).toBeTruthy();
  });
});
