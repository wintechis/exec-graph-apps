import { render } from '@testing-library/react';

import RDFTermInput from './rdfterm-input';

describe('RDFTermInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <RDFTermInput
        value={''}
        options={[]}
        onChange={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
