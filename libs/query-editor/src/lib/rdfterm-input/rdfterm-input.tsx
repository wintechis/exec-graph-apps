import { Combobox } from '@headlessui/react';
import React, { useState } from 'react';

/**
 * One element in the autocomplete list of {@link RDFTermInput}
 */
export interface Option {
  value: string;
  label?: string;
}

/**
 * Type definition of mandatory and optional properties of the {@link RDFTermInput} component
 */
export interface RDFTermInputProps {
  inputName?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

/**
 * Displays an input field with autocomplete, this allows
 * arbitrary values to be inserted (variables, literals)
 * while supporting the user with a autocomplete of URIs
 * (with nice labels).
 *
 * @category React Component
 */
export function RDFTermInput(props: RDFTermInputProps): JSX.Element {
  const [query, setQuery] = useState('');
  const currentValue = React.useMemo(
    () =>
      props.options.find((p) => p.value === props?.value) || {
        value: props.value,
        label: props.value,
      },
    [props.options, props.value]
  );

  const filteredOptions =
    query === ''
      ? props.options
      : props.options.filter((o) => {
          return (o.label || o.value)
            ?.toLowerCase()
            .includes(query.toLowerCase());
        });

  const displayValue = (option: Option) => {
    return option?.label || option?.value;
  };
  const onChange = (option: Option | null) => {
    props.onChange(option?.value || '');
  };
  return (
    <div className="relative grow w-full">
      <Combobox value={currentValue} onChange={onChange} nullable>
        <Combobox.Button className="grow w-full block">
          <Combobox.Input
            className="grow shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2 select-all"
            autoComplete="off"
            name={props.inputName}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={displayValue}
            onKeyUp={(event: React.KeyboardEvent) => event.preventDefault()}
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 w-full ring-1 ring-fau-blue ring-opacity-5 focus:outline-none mt-1 bg-white shadow border border-gray-300 rounded-md max-h-64 py-2 text-sm overflow-auto">
          {query.length > 0 && (
            <Combobox.Option
              value={{ value: query, label: query }}
              className="select-none px-2 py-1 hover:bg-fau-blue hover:text-white"
            >
              {query}
            </Combobox.Option>
          )}
          {filteredOptions.map((option) => (
            <Combobox.Option
              className="select-none px-2 py-1 hover:bg-fau-blue hover:text-white"
              key={option.value}
              value={option}
            >
              {displayValue(option)}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}

export default RDFTermInput;
