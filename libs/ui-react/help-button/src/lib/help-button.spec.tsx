import { render } from '@testing-library/react';

import HelpButton from './help-button';

describe('HelpButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HelpButton advise={'Hello World'} />);
    expect(baseElement).toBeTruthy();
  });
});
