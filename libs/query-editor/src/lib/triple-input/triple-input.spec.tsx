import { render } from '@testing-library/react';
import { Triple } from '../query-modifiers/query.types';

import TripleInput from './triple-input';

describe('TripleInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TripleInput
        index={0}
        triple={{ subject: '', predicate: '', object: '' }}
        autocompleteProperty={[]}
        autocompleteFilterValue={[]}
        onRemove={function (index: number): void {
          throw new Error('Function not implemented.');
        }}
        onChange={function (changedTriple: Triple): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
