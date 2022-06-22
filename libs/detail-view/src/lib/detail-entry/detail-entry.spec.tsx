import { render } from '@testing-library/react';

import DetailEntry from './detail-entry';

describe('DetailEntry', () => {
  it('should render successfully', () => {
    const { asFragment } = render(<DetailEntry label="A number" value={100} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
