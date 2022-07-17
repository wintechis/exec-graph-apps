import { SparqlValidator } from '@exec-graph/graph/data-source-remote';
import { DataSource } from '@exec-graph/graph/types';
import { History, Query } from '@exec-graph/explorer/types';
import { HiOutlineSearch } from 'react-icons/hi';
import { Component } from 'react';
import AdvancedEditor from '../advanced-editor/advanced-editor';
import QueryHistory from '../query-history/query-history';
import QueryLibrary from '../query-library/query-library';
import {
  RdfAutocompletionContext,
  RdfAutocompletionService,
  RdfAutocompletionState,
} from '../rdf-autocompletion.service';
import SimpleEditor from '../simple-editor/simple-editor';
import SparqlEditor from '../sparql-editor/sparql-editor';
import TabBar from '../tab-bar/tab-bar';

/**
 * Defines string keys for the different sub editors
 */
type EditorKey = 'library' | 'simple' | 'advanced' | 'sparql' | 'history';

/**
 * Type definition of mandatory and optional properties of the {@link QueryEditor} component
 */
export interface QueryEditorProps {
  /**
   * endpoint to run informational queries e.g. for autocompletion against
   */
  dataSource: DataSource;
  /**
   * the currently selected query (used as starting point)
   */
  query: Query;
  /**
   * Invoked when user selected/confirmed a query
   * @param sparql the selected query
   */
  onSubmit: (query: Query) => void;
  /**
   * Title of the form, modifiable in case the form is embedded in a different context (e.g. dialog)
   */
  title?: string | JSX.Element;
  /**
   * Enables the selection of previously executed queries
   */
  history: History;
}

/**
 * Type definition of the internal state of the {@link QueryEditor} component
 */
interface QueryEditorState {
  editorKey: EditorKey;
  title: string;
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
      title: props.query.title,
      sparql: props.query.sparql,
      valid: this.sparqlValidator.validate(props.query.sparql),
      rdfAutocompletion: this.rdfAutocompletionService.initState(
        (updatedState) =>
          this.setState({
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
  public override componentDidMount(): void {
    this.state.rdfAutocompletion.loadProperties();
  }

  /**
   * Process changed sparql from a sub-editor
   *
   * @param sparql sparql query
   */
  private handleChange(query: Query): void {
    this.setState({
      title: query.title,
      sparql: query.sparql,
      valid: this.sparqlValidator.validate(query.sparql),
    });
  }

  /**
   * Switch to a different editor
   *
   * @param editorKey reference to the editor to open
   */
  private switchTo(editorKey: EditorKey): void {
    this.setState({
      editorKey,
    });
  }

  /**
   * Submit current sparql query to calling component
   *
   * @param event the html event to prevent the default action
   */
  private handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    this.props.onSubmit({ title: this.state.title, sparql: this.state.sparql });
  }

  /**
   * Combine the different UI elements based on the user selection to create the query editor
   *
   * @returns the editor form to be included in a dialog or page
   */
  public override render(): JSX.Element {
    const validationError = this.state.valid ? null : (
      <div className="text-fau-red">
        Invalid SPARQL: Please check your query.
      </div>
    );

    const currentEditor =
      this.state.editorKey === 'library' ? (
        <QueryLibrary onSelect={this.handleChange}></QueryLibrary>
      ) : this.state.editorKey === 'simple' ? (
        <SimpleEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
        ></SimpleEditor>
      ) : this.state.editorKey === 'advanced' ? (
        <AdvancedEditor
          sparql={this.state.sparql}
          onChange={this.handleChange}
          rdfAutocompletionService={this.rdfAutocompletionService}
        ></AdvancedEditor>
      ) : this.state.editorKey === 'history' ? (
        <QueryHistory
          localStorageEnabled={this.props.history.storedLocally}
          history={this.props.history.queries}
          onSelect={this.handleChange}
          toggleLocalStorage={(event: boolean) =>
            event
              ? this.props.history.enableLocalStorage()
              : this.props.history.disableLocalStorage()
          }
        ></QueryHistory>
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
                { label: 'Library', value: 'library' },
                { label: 'Filter', value: 'simple' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'SPARQL', value: 'sparql' },
                { label: 'History', value: 'history' },
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
                <HiOutlineSearch className="w-5 h-5 mr-2" />
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
