import { render } from '@testing-library/react';

import LoadingBar, { LoadingStatus } from './loading-bar';

describe('LoadingBar', () => {
  it('should render successfully', () => {
    const steps = [
      {
        name: 'Graph Data',
        width: 'w-1/6',
        status: LoadingStatus.LOADED,
      },
      {
        name: 'All Details',
        width: 'w-3/6',
        status: LoadingStatus.NOT_STARTED,
      },
      {
        name: 'WikiData.org',
        width: 'w-2/6',
        status: LoadingStatus.ERROR,
      },
    ];
    const { baseElement } = render(<LoadingBar steps={steps} />);
    expect(baseElement).toBeTruthy();
  });
});
