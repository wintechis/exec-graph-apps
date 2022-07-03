import { HelpButton } from '@exec-graph/ui-react/help-button';
import { useContext } from 'react';
import { Triple } from '../query-modifiers/query.types';
import {
  optionsFor,
  RdfAutocompletionContext,
} from '../rdf-autocompletion.service';
import RDFTermInput from '../rdfterm-input/rdfterm-input';

/**
 * Type definition of mandatory and optional properties of the {@link TripleInput} component
 */
export interface TripleInputProps {
  /**
   * index of the triple in the list it is part of (used to idenify form elements and remove the triple)
   */
  index: number;
  /**
   * the triple to edit
   */
  triple: Triple;
  /**
   * Internal remove button was clicked
   * @param index triple to remove, will match the index prop
   */
  onRemove: (index: number) => void;
  /**
   * Called when a part of the triple changed
   * @param changedTriple triple with the updated information
   */
  onChange: (changedTriple: Triple) => void;
}

/**
 * Renders the form elements required for a triple to be edited
 *
 * @category React Component
 */
export function TripleInput(props: TripleInputProps): JSX.Element {
  // import autocompletion context
  const rdfAutocompletionContext = useContext(RdfAutocompletionContext);

  /**
   * event handler for changes in the subject input
   * @param event the change event from the input field
   */
  const onSubjectChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    props.onChange({ ...props.triple, subject: event.target.value || '' });
  };

  /**
   * event handler for changes in the predicate (property) field
   * @param event the change event from the input field
   */
  const onPropertyChange = (change: string): void => {
    // resetting object value, as its likely not valid anymore (could improve this by checking the range of the predicate)
    props.onChange({ ...props.triple, predicate: change, object: '' });
    // TODO this.loadAutocomplete(predicate);
  };

  /**
   * event handler for changes in the object (filter value) input
   * @param event the change event from the input field
   */
  const onFilterValueChange = (change: string): void => {
    props.onChange({ ...props.triple, object: change });
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap mb-4 items-end ">
      <div className="w-36 mr-2">
        <label
          htmlFor={`propertyFilterSubject_${props.index}`}
          className="block text-sm font-medium text-gray-700"
        >
          Subject #{props.index}{' '}
          <HelpButton advise={'Please enter a variable or URI.'}></HelpButton>
        </label>
        <input
          name={`propertyFilterSubject_${props.index}`}
          value={props.triple.subject}
          onChange={onSubjectChange}
          className="grow shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
        ></input>
      </div>
      <div className="grow mr-2">
        <label
          htmlFor={`propertySelect_${props.index}`}
          className="block text-sm font-medium text-gray-700"
        >
          Property{' '}
          <HelpButton
            advise={
              'Please enter a variable or URI to indicate the property on the subject that must be matched.'
            }
          ></HelpButton>
        </label>
        <RDFTermInput
          inputName={`propertySelect_${props.index}`}
          value={props.triple.predicate}
          onChange={onPropertyChange}
          options={rdfAutocompletionContext.propertiesAsOptions || []}
        ></RDFTermInput>
      </div>
      <div className="grow mr-2">
        <label
          htmlFor={`propertyFilterValue_${props.index}`}
          className="block text-sm font-medium text-gray-700 relative z-10"
        >
          Matches{' '}
          <HelpButton
            advise={
              'Please enter a variable, URI or literal value that the property on the subject must match.'
            }
          ></HelpButton>
        </label>
        <RDFTermInput
          inputName={`propertyFilterValue_${props.index}`}
          value={props.triple.object || ''}
          onChange={onFilterValueChange}
          options={optionsFor(props.triple.predicate, rdfAutocompletionContext)}
        ></RDFTermInput>
      </div>
      <div>
        <button
          type="button"
          onClick={() => props.onRemove(props.index)}
          className="inline-flex justify-center py-2 px-4 border border-fau-red shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default TripleInput;
