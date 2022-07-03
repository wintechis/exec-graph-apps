import { fireEvent, render, screen } from '@testing-library/react';

import TabBar from './tab-bar';

describe('TabBar', () => {
  it('should render successfully', () => {
    const { asFragment } = render(
      <TabBar
        onChange={() => null}
        selected={0}
        options={[
          { value: 0, label: 'Null' },
          { value: 1, label: 'Eins' },
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('it is interactive', async () => {
    const mockCallback = jest.fn();
    render(
      <TabBar
        onChange={mockCallback}
        selected={0}
        options={[
          { value: 0, label: 'Null' },
          { value: 1, label: 'Eins' },
        ]}
      />
    );
    fireEvent.click(screen.getByText('Eins'));
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(1);
  });
});
