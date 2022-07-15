import { useCamera } from '@react-sigma/core';
import { ChangeEvent, memo, useState } from 'react';
import { useEffect } from 'react';
import { Attributes } from 'graphology-types';
import { useSigma } from '@react-sigma/core';

/**
 * Type definition of mandatory and optional properties of the {@link SearchControl} component
 */
export interface SearchControlsProps {
  /**
   * Invoked when the user selected an item through the search
   */
  onSelectionChange?: (node: string | null) => void;
}

/**
 * A search field to search the 2D graph
 *
 * This is a slightly modified version of the @react-sigma/core search control which directly notifies the child
 *
 * @see https://github.com/sim51/react-sigma/blob/105aab04ecbdaf100b8a78704dac52b3e8387858/packages/core/src/components/controls/SearchControl.tsx
 * @category React component
 */
export const SearchControl = memo((props: SearchControlsProps) => {
  // Get sigma
  const sigma = useSigma();
  // Get camera hook
  const { gotoNode } = useCamera();
  // Search value
  const [search, setSearch] = useState<string>('');
  // Datalist values
  const [values, setValues] = useState<Array<{ id: string; label: string }>>(
    []
  );
  // Selected
  const [selected, setSelected] = useState<string | null>(null);
  // random id for the input
  const [inputId, setInputId] = useState<string>('');

  /**
   * When component mount, we set a random input id.
   */
  useEffect(() => {
    setInputId(`search-${getUniqueKey()}`);
  }, []);

  /**
   * When the search input changes, recompute the autocomplete values.
   */
  useEffect(() => {
    const newValues: Array<{ id: string; label: string }> = [];
    if (!selected && search.length > 1) {
      sigma
        .getGraph()
        .forEachNode((key: string, attributes: Attributes): void => {
          if (
            attributes['label'] &&
            attributes['label'].toLowerCase().includes(search.toLowerCase())
          )
            newValues.push({ id: key, label: attributes['label'] });
        });
    }
    setValues(newValues);
  }, [search, selected]);

  /**
   * When the selected item changes, highlighted the node and center the camera on it.
   */
  useEffect(() => {
    if (!selected) {
      return;
    }

    if (props.onSelectionChange) {
      // notify the parent about the change
      props.onSelectionChange(selected);
    }

    sigma.getGraph().setNodeAttribute(selected, 'highlighted', true);
    gotoNode(selected);

    return () => {
      sigma.getGraph().setNodeAttribute(selected, 'highlighted', false);
      if (props.onSelectionChange) {
        // notify the parent about the change
        props.onSelectionChange(null);
      }
    };
  }, [selected, props]);

  /**
   * On change event handler for the search input, to set the state.
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    const valueItem = values.find((value) => value.label === searchString);
    if (valueItem) {
      setSearch(valueItem.label);
      setValues([]);
      setSelected(valueItem.id);
    } else {
      setSelected(null);
      setSearch(searchString);
    }
  };

  return (
    <div className="react-sigma-search">
      <label htmlFor={inputId} style={{ display: 'none' }}>
        Search a node
      </label>
      <input
        id={inputId}
        type="text"
        placeholder="Search..."
        list={`${inputId}-datalist`}
        value={search}
        onChange={onInputChange}
      />
      <datalist id={`${inputId}-datalist`}>
        {values.map((value: { id: string; label: string }) => (
          <option key={value.id} value={value.label}>
            {value.label}
          </option>
        ))}
      </datalist>
    </div>
  );
});

/**
 * Generate a randomised string for use in CSS ids
 *
 * @returns a random string identifier
 */
function getUniqueKey(): string {
  return Math.random().toString(36).slice(2);
}
