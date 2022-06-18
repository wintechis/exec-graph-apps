import { render } from '@testing-library/react';

import LoadingBar, { LoadingStatus } from './loading-bar';

describe('LoadingBar', () => {
  it('should render successfully', () => {
    const steps = [
      {
        name: 'Graph Data',
        width: '1/6',
        status: LoadingStatus.LOADED,
      },
      {
        name: 'All Details',
        width: '3/6',
        status: LoadingStatus.NOT_STARTED,
      },
      {
        name: 'WikiData.org',
        width: '2/6',
        status: LoadingStatus.ERROR,
      },
    ];
    const { baseElement } = render(<LoadingBar steps={steps} />);
    expect(baseElement).toBeTruthy();
  });
});
