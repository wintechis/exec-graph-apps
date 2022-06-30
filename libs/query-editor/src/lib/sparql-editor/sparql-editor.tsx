/**
 * Type definition of mandatory and optional properties of the {@link SparqlEditor} component
 */
export interface SparqlEditorProps {
  sparql: string;
  onChange: (sparql: string) => void;
}

/**
 * Displays an editor for SPARQL queries
 *
 * @category React Component
 */
export function SparqlEditor(props: Readonly<SparqlEditorProps>): JSX.Element {
  /**
   * event handler to notify parent of a query change
   * @param event the DOM event emmitted from the textarea field
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    event.preventDefault();
    props.onChange(event.target.value);
  };

  return (
    <div className="px-4 py-5 space-y-6 sm:p-6">
      <div>
        <label
          htmlFor="sparql"
          className="block text-sm font-medium text-gray-700"
        >
          SPARQL-Query
        </label>
        <textarea
          name="sparql"
          rows={10}
          value={props.sparql}
          onChange={handleChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
        />
      </div>
    </div>
  );
}

export default SparqlEditor;
