import { render } from '@testing-library/react';

import ExploreDialog from './dialog';

describe('ExploreDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ExploreDialog
        show={true}
        title="Hello World"
        width="max-w-xl"
        close={() => null}
      >
        <span>Hello You</span>
      </ExploreDialog>
    );
    expect(baseElement).toBeTruthy();
  });
});
