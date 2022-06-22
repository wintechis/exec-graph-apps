import { fireEvent, render, screen } from '@testing-library/react';

import ButtonToggle from './button-toggle';

describe('ButtonToggle', () => {
  it('should render successfully', () => {
    const { asFragment } = render(
      <ButtonToggle
        label="Group by"
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
      <ButtonToggle
        label="Group by"
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
