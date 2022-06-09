import { Component } from 'react';

export interface SparqlEditorProps {
  sparql: string;
  onChange: (sparql: string) => void;
}

/**
 * Displays an editor for SPARQL queries
 *
 * @category React Component
 */
export class SparqlEditor extends Component<SparqlEditorProps> {
  constructor(props: Readonly<SparqlEditorProps>) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    this.props.onChange(event.target.value);
  }

  override render() {
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
            value={this.props.sparql}
            onChange={this.handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    );
  }
}

export default SparqlEditor;
