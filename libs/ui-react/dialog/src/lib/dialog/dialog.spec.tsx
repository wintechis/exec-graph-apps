import { render } from '@testing-library/react';

import Dialog from './dialog';

describe('Dialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Dialog
        show={true}
        title="Hello World"
        width="max-w-xl"
        close={() => null}
      >
        <span>Hello You</span>
      </Dialog>
    );
    expect(baseElement).toBeTruthy();
  });
});
