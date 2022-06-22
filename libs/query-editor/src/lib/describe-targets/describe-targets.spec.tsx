import { render } from '@testing-library/react';

import DescribeTargets from './describe-targets';

describe('DescribeTargets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DescribeTargets />);
    expect(baseElement).toBeTruthy();
  });
});
