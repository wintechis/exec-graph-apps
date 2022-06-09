import { SparqlValidator } from '@exec-graph/graph/data-source-remote';
import { DataSource } from '@exec-graph/graph/types';
import { Component } from 'react';
import FormEditor from '../form-editor/form-editor';
import SparqlEditor from '../sparql-editor/sparql-editor';
import TabBar from '../tab-bar/tab-bar';

type EditorKey = 'form' | 'sparql';

export interface QueryEditorProps {
  dataSource: DataSource;
  sparql: string;
  onSubmit: (sparql: string) => void;
}

interface QueryEditorState {
  editorKey: EditorKey;
  sparql: string;
  valid: boolean;
}

/**
 * Container that groups together different sparql editors
 */
export class QueryEditor extends Component<QueryEditorProps, QueryEditorState> {
  private sparqlValidator: SparqlValidator;

  constructor(props: Readonly<QueryEditorProps>) {
    super(props);
    this.sparqlValidator = new SparqlValidator();
    this.state = {
      editorKey: 'form',
      sparql: props.sparql,
      valid: this.sparqlValidator.validate(props.sparql),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.switchTo = this.switchTo.bind(this);
  }

  handleChange(sparql: string) {
    this.setState({
      ...this.state,
      sparql: sparql,
      valid: this.sparqlValidator.validate(sparql),
    });
  }

  switchTo(editorKey: EditorKey) {
    this.setState({
      ...this.state,
      editorKey,
    });
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.props.onSubmit(this.state.sparql);
  }

  public override render() {
    const validationError = this.state.valid ? null : (
      <div className="text-fau-red">
        Invalid SPARQL: Please check your query.
      </div>
    );

    const currentEditor =
      this.state.editorKey === 'form' ? (
        <FormEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
          dataSource={this.props.dataSource}
        ></FormEditor>
      ) : (
        <SparqlEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
        ></SparqlEditor>
      );

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="max-h-[48rem] flex flex-col">
          <div className="bg-white shadow">
            <h1 className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
              Query Editor
            </h1>
            <TabBar
              selected={this.state.editorKey}
              options={[
                { label: 'Filter', value: 'form' },
                { label: 'SPARQL', value: 'sparql' },
              ]}
              onChange={this.switchTo}
            ></TabBar>
          </div>
          <div className="overflow-y-scroll shrink grow">{currentEditor}</div>
          <div className="bg-white p-4 flex flex-wrap">
            {validationError}
            <div className="text-right mt-4 ml-auto">
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
          </div>
        </div>
      </form>
    );
  }
}

export default QueryEditor;
