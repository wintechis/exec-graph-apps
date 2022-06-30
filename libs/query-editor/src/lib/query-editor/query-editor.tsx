import { SparqlValidator } from '@exec-graph/graph/data-source-remote';
import { DataSource } from '@exec-graph/graph/types';
import { SearchIcon } from '@heroicons/react/outline';
import { Component } from 'react';
import AdvancedEditor from '../advanced-editor/advanced-editor';
import QueryLibrary from '../query-library/query-library';
import {
  RdfAutocompletionContext,
  RdfAutocompletionService,
  RdfAutocompletionState,
} from '../rdf-autocompletion.service';
import SparqlEditor from '../sparql-editor/sparql-editor';
import TabBar from '../tab-bar/tab-bar';

/**
 * Defines string keys for the different sub editors
 */
type EditorKey = 'library' | 'advanced' | 'sparql';

/**
 * Type definition of mandatory and optional properties of the {@link QueryEditor} component
 */
export interface QueryEditorProps {
  dataSource: DataSource;
  sparql: string;
  onSubmit: (sparql: string) => void;
  title?: string | JSX.Element;
}

/**
 * Type definition of the internal state of the {@link QueryEditor} component
 */
interface QueryEditorState {
  editorKey: EditorKey;
  sparql: string;
  valid: boolean;
  rdfAutocompletion: RdfAutocompletionState;
}

/**
 * Container that groups together different sparql editors
 */
export class QueryEditor extends Component<QueryEditorProps, QueryEditorState> {
  private sparqlValidator: SparqlValidator;
  private rdfAutocompletionService: RdfAutocompletionService;

  constructor(props: Readonly<QueryEditorProps>) {
    super(props);
    this.sparqlValidator = new SparqlValidator();
    this.rdfAutocompletionService = new RdfAutocompletionService(
      props.dataSource
    );
    this.state = {
      editorKey: 'library',
      sparql: props.sparql,
      valid: this.sparqlValidator.validate(props.sparql),
      rdfAutocompletion: this.rdfAutocompletionService.initState(
        (updatedState) =>
          this.setState({
            ...this.state,
            rdfAutocompletion: {
              ...this.state.rdfAutocompletion,
              ...updatedState,
            },
          }),
        () => this.state.rdfAutocompletion
      ),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.switchTo = this.switchTo.bind(this);
  }

  /**
   * Initiate loading of autocomplete lists after inital mounting of the component
   */
  override componentDidMount(): void {
    this.state.rdfAutocompletion.loadProperties();
  }

  /**
   * Process changed sparql from a sub-editor
   *
   * @param sparql sparql query
   */
  private handleChange(sparql: string): void {
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

  public override render(): JSX.Element {
    const validationError = this.state.valid ? null : (
      <div className="text-fau-red">
        Invalid SPARQL: Please check your query.
      </div>
    );

    const currentEditor =
      this.state.editorKey === 'library' ? (
        <QueryLibrary onSelect={this.handleChange}></QueryLibrary>
      ) : this.state.editorKey === 'advanced' ? (
        <AdvancedEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
          rdfAutocompletionService={this.rdfAutocompletionService}
        ></AdvancedEditor>
      ) : (
        <SparqlEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
        ></SparqlEditor>
      );

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="max-h-[80vh] bg-white rounded flex flex-col">
          <div className="shadow">
            {this.props.title || (
              <h1 className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
                Query Editor
              </h1>
            )}
            <TabBar
              selected={this.state.editorKey}
              options={[
                { label: 'Libary', value: 'library' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'SPARQL', value: 'sparql' },
              ]}
              onChange={this.switchTo}
            ></TabBar>
          </div>
          <div className="overflow-y-scroll shrink grow bg-gray-100">
            <RdfAutocompletionContext.Provider
              value={this.state.rdfAutocompletion}
            >
              {currentEditor}
            </RdfAutocompletionContext.Provider>
          </div>
          <div className="p-4 flex flex-wrap">
            {validationError}
            <div className="text-right mt-4 ml-auto">
              <button
                disabled={!this.state.valid}
                type="submit"
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-fau-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !this.state.valid ? 'bg-gray-400' : ''
                }`}
              >
                <SearchIcon className="w-5 h-5 mr-2"></SearchIcon>
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