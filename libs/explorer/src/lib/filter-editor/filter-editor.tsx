import { SparqlValidator } from '@exec-graph/graph/data-source-remote';
import { Component } from 'react';

// by class.ttl

export interface FilterEditorProps {
  sparql: string;
  onSubmit: (sparql: string) => void;
}

/**
 * Displays an editor for SPARQL queries
 *
 * @category React Component
 */
export class FilterEditor extends Component<
  FilterEditorProps,
  { sparql: string; valid: boolean }
> {
  private sparqlValidator: SparqlValidator;

  constructor(props: Readonly<FilterEditorProps>) {
    super(props);
    this.sparqlValidator = new SparqlValidator();
    this.state = {
      sparql: props.sparql,
      valid: this.sparqlValidator.validate(props.sparql),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      sparql: event.target.value,
      valid: this.sparqlValidator.validate(event.target.value),
    });
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.props.onSubmit(this.state.sparql);
  }

  override render() {
    const validationError = this.state.valid ? null : (
      <div className="text-fau-red">
        Invalid SPARQL: Please check your query.
      </div>
    );
    return (
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <h3 className="text-lg font-bold leading-6">SPARQL Query Editor</h3>
        <form onSubmit={this.handleSubmit}>
          <label
            htmlFor="sparql"
            className="block text-sm font-medium text-gray-700"
          >
            SPARQL-Query
          </label>
          <textarea
            name="sparql"
            rows={10}
            value={this.state.sparql}
            onChange={this.handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          />
          {validationError}
          <div className="text-right mt-4">
            <button
              disabled={!this.state.valid}
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-fau-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !this.state.valid ? 'bg-gray-400' : ''
              }`}
            >
              Execute
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FilterEditor;
