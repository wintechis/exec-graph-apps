import { SparqlInput } from '@exec-graph/ui-react/sparql-input';

/**
 * Type definition of mandatory and optional properties of the {@link SparqlEditor} component
 */
export interface SparqlEditorProps {
  /**
   * The current sparql to be edited, can be an empty string
   */
  sparql: string;
  /**
   * Triggered when the user changed the sparql query
   */
  onChange: (sparql: string) => void;
}

/**
 * Displays an editor for SPARQL queries
 *
 * @category React Component
 */
export function SparqlEditor(props: Readonly<SparqlEditorProps>): JSX.Element {
  return (
    <div className="px-4 py-5 space-y-6 sm:p-6 min-h-[16rem]">
      <div>
        <label
          htmlFor="sparql"
          className="block text-sm font-medium text-gray-700"
        >
          SPARQL-Query
        </label>
        <SparqlInput
          value={props.sparql}
          onChange={props.onChange}
        ></SparqlInput>
      </div>
    </div>
  );
}

export default SparqlEditor;
