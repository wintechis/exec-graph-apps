import { ButtonToggle } from '@exec-graph/ui-react/button-toggle';
import { HelpButton } from '@exec-graph/ui-react/help-button';
import { Component } from 'react';
import { Generator, Parser, SparqlQuery } from 'sparqljs';
import DescribeTargets from '../describe-targets/describe-targets';
import QueryModifiers from '../query-modifiers/query-modifiers';
import {
  Modifiers,
  QueryBuilder,
  SparqlQueryType,
  Term,
  Triple,
} from '../query-modifiers/query.types';
import { RdfAutocompletionService } from '../rdf-autocompletion.service';
import TripleInput from '../triple-input/triple-input';

export interface AdvancedEditorProps {
  rdfAutocompletionService: RdfAutocompletionService;
  sparql: string;
  onChange: (sparql: string) => void;
}

interface AdvancedEditorState {
  sparql: string;
  queryType: SparqlQueryType;
  propertiesFilter?: { predicate: string; object: string; subject: string }[];
  /**
   * List of all variables that were defined in the where block
   */
  variables: string[];
  query: {
    modifiers: Modifiers;
    describeTargets?: string[];
    selectColumns?: string[];
    constructTemplate?: Triple[];
  };
}

const DEFAULT_STATE: AdvancedEditorState = {
  sparql: '',
  queryType: 'SELECT',
  propertiesFilter: [{ predicate: '?p', object: '?o', subject: '?s' }],
  variables: [],
  query: {
    describeTargets: [''],
    modifiers: { orderByDir: '', orderBy: null, limit: null, offset: null },
  },
};

/**
 * UI Element that offers a user different advanced
 * filter options approximating a SPARQL query,
 * the input will be converted to a sparql query
 *
 * In particular it allows different query types and
 * filtering by property values
 *
 * @category React Component
 */
export class AdvancedEditor extends Component<
  AdvancedEditorProps,
  AdvancedEditorState
> {
  constructor(props: Readonly<AdvancedEditorProps>) {
    super(props);
    this.state = { ...DEFAULT_STATE, sparql: props.sparql };
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
    this.handlePropertyFilterChange =
      this.handlePropertyFilterChange.bind(this);
    this.handleDescribeTargetsChange =
      this.handleDescribeTargetsChange.bind(this);
    this.handleModifierChange = this.handleModifierChange.bind(this);
  }

  public override componentDidMount(): void {
    this.setStateFromSparql(this.props.sparql);
  }

  public override componentDidUpdate(
    _prevProps: Readonly<AdvancedEditorProps>,
    prevState: Readonly<AdvancedEditorState>
  ) {
    if (this.props.sparql !== prevState.sparql) {
      this.setStateFromSparql(this.props.sparql);
    }
  }

  private setStateFromSparql(sparql: string) {
    let parsed: SparqlQuery;
    try {
      parsed = new Parser({}).parse(sparql);
    } catch {
      return;
    }

    if (parsed.type !== 'query') {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const orderByTerm = parsed['order']?.[0]?.['expression'];
    const modifiers: Modifiers = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      limit: parsed['limit'] || null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      offset: parsed['offset'] || null,
      orderBy:
        orderByTerm?.termType === 'Variable'
          ? '?' + orderByTerm['value']
          : null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderByDir: parsed['order']?.[0]
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          parsed['order'][0]['descending'] === true
          ? 'DESCENDING'
          : 'ASCENDING'
        : '',
    };
    let selectColumns: string[] | undefined = undefined;
    if (parsed.queryType === 'SELECT') {
      selectColumns = (parsed.variables as Term[])
        .filter((t) => t.termType === 'Variable')
        .map((t) => '?' + t.value);
    }
    let constructTemplate: Triple[] | undefined = undefined;
    if (parsed.queryType === 'CONSTRUCT') {
      constructTemplate =
        parsed.template?.map((triple) => ({
          subject: QueryBuilder.termToString(triple.subject),
          predicate: QueryBuilder.termToString(triple.predicate as Term),
          object: QueryBuilder.termToString(triple.object),
        })) || undefined;
    }
    let describeTargets: string[] = [];
    if (parsed.queryType === 'DESCRIBE') {
      describeTargets = (parsed.variables as Term[])
        .filter((t) => t.termType === 'NamedNode')
        .map((t) => t.value);
    }

    this.setState({
      ...this.state,
      queryType: parsed.queryType,
      sparql: sparql,
      query: {
        ...this.state.query,
        modifiers,
        describeTargets,
        selectColumns,
        constructTemplate,
      },
    });
  }

  private buildQuery(): void {
    const queryBuilder = new QueryBuilder(this.state.queryType);
    let variables: string[] = [];
    if (
      this.state.queryType === 'SELECT' ||
      this.state.queryType === 'CONSTRUCT'
    ) {
      const whereBlockVariables: { [varname: string]: Term } = {};
      const wherePropertiesMatchTriples: object[] = [];
      this.state.propertiesFilter?.forEach((propFilter) => {
        const triple = {
          subject: QueryBuilder.term(propFilter.subject),
          predicate: QueryBuilder.term(propFilter.predicate),
          object: QueryBuilder.term(String(propFilter.object)),
        };
        if (propFilter.subject && propFilter.predicate && propFilter.object) {
          // only complete triples should be part of the query
          wherePropertiesMatchTriples.push(triple);
        }
        if (triple.subject.termType === 'Variable') {
          whereBlockVariables[propFilter.subject] = triple.subject;
        }
        if (triple.predicate.termType === 'Variable') {
          whereBlockVariables[propFilter.predicate] = triple.predicate;
        }
        if (triple.object.termType === 'Variable') {
          whereBlockVariables[propFilter.object] = triple.object;
        }
      });
      if (
        this.state.queryType === 'CONSTRUCT' &&
        this.state.query.constructTemplate
      ) {
        queryBuilder.template(
          this.state.query.constructTemplate.map((t) => ({
            subject: QueryBuilder.term(t.subject),
            predicate: QueryBuilder.term(t.predicate),
            object: QueryBuilder.term(String(t.object)),
          }))
        );
      } else {
        queryBuilder.select(
          this.state.queryType === 'SELECT' && this.state.query.selectColumns
            ? this.state.query.selectColumns.map((v) => QueryBuilder.term(v))
            : Object.values(whereBlockVariables)
        );
      }
      variables = Object.keys(whereBlockVariables);
      if (wherePropertiesMatchTriples.length > 0) {
        queryBuilder.addWhereTriples(wherePropertiesMatchTriples);
      }
      queryBuilder.addModifiers(this.state.query.modifiers);
    }
    if (
      this.state.queryType === 'DESCRIBE' &&
      this.state.query.describeTargets
    ) {
      queryBuilder.addDescribeTargets(this.state.query.describeTargets);
    }
    try {
      const generator = new Generator();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const sparql = generator.stringify(queryBuilder.getQuery());
      this.setState({ ...this.state, sparql, variables });
      this.props.onChange(sparql);
    } catch ($e) {
      console.error($e);
      this.setState({ ...this.state, sparql: 'Invalid', variables });
    }
  }

  private handleQueryTypeChange(queryType: SparqlQueryType) {
    this.setState(
      {
        ...this.state,
        queryType,
      },
      () => this.buildQuery()
    );
  }

  private handleDescribeTargetsChange(targets: string[]) {
    this.setState(
      {
        ...this.state,
        query: { ...this.state.query, describeTargets: targets },
      },
      () => this.buildQuery()
    );
  }

  private handleModifierChange(modifiers: Modifiers) {
    this.setState(
      {
        ...this.state,
        query: { ...this.state.query, modifiers },
      },
      () => this.buildQuery()
    );
  }

  private handlePropertyFilterChange(index: number) {
    return (updatedTriple: {
      predicate: string;
      object: string;
      subject: string;
    }) => {
      const propertiesFilter = this.state.propertiesFilter || [];
      propertiesFilter[index] = updatedTriple;
      this.setState(
        {
          ...this.state,
          propertiesFilter,
        },
        () => this.buildQuery()
      );
    };
  }

  public override render() {
    return (
      <div className="px-4 py-5 space-y-6 sm:p-6">
        <p className="text-sm text-gray-600 max-w-prose">
          The advanced editor allows to create queries of different types and
          with multiple conditions, however its capabilities are limited in
          comparision to writing custom SPARQL queries.
        </p>
        {this.renderQueryTypeSelector()}
        {this.renderQueryTypeDependendFields()}
        {this.renderSparqlPreview()}
      </div>
    );
  }

  private renderQueryTypeSelector(): JSX.Element {
    return (
      <div className="flex mb-4 relative z-20">
        <ButtonToggle
          selected={this.state.queryType}
          onChange={this.handleQueryTypeChange}
          options={[
            { label: 'Graph (CONSTRUCT)', value: 'CONSTRUCT' },
            { label: 'Tabular (SELECT)', value: 'SELECT' },
            { label: 'Focus (DESCRIBE)', value: 'DESCRIBE' },
          ]}
        ></ButtonToggle>
        <HelpButton
          advise={
            'This form makes use of SPARQL, which supports different query types. The most common are CONSTRUCT to return a graph or SELECT to return a table. You may also issue a DESCRIBE query to get all details of one object as a graph.'
          }
        ></HelpButton>
      </div>
    );
  }

  /**
   * Adds a field to show the generated SPARQL query
   */
  private renderSparqlPreview(): JSX.Element {
    return (
      <div className="mt-4 pt-2 border-t">
        <label
          htmlFor="sparql"
          className="block text-sm font-medium text-gray-700"
        >
          Generated SPARQL Query{' '}
          <HelpButton
            advise={
              'Your inputs have been converted to this SPARQL-Query, press "Execute" below to send it off or go to the SPARQL tab above to edit it manually.'
            }
          ></HelpButton>
        </label>
        <textarea
          name="sparql"
          readOnly={true}
          rows={3}
          value={this.props.sparql}
          className="shadow-sm mt-1 bg-gray-200 text-gray-600 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
        />
      </div>
    );
  }

  private renderQueryTypeDependendFields(): JSX.Element {
    if (this.state.queryType === 'SELECT') {
      return (
        <>
          {this.includePropertyFilter()}
          {this.includeColumnSelector()}
          {this.includeQueryModifiers()}
        </>
      );
    }
    if (this.state.queryType === 'CONSTRUCT') {
      return (
        <>
          {this.includePropertyFilter()}
          {this.includeConstructGraphSelector()}
          {this.includeQueryModifiers()}
        </>
      );
    }
    if (this.state.queryType === 'DESCRIBE') {
      return (
        <DescribeTargets
          targets={this.state.query.describeTargets || []}
          onChange={this.handleDescribeTargetsChange}
        ></DescribeTargets>
      );
    }
    console.error(
      'Unknown query type, could not generate type depenend fields'
    );
    return <div></div>;
  }

  private updateConstructTemplate(index: number) {
    return (templateRow: Triple) => {
      const constructTemplate = this.state.query.constructTemplate || [];
      constructTemplate[index] = templateRow;
      this.setState(
        {
          ...this.state,
          query: {
            ...this.state.query,
            constructTemplate,
          },
        },
        () => this.buildQuery()
      );
    };
  }

  private includeConstructGraphSelector() {
    return (
      <div>
        <h4 className="font-bold mb-2 relative z-10">
          Graph{' '}
          <HelpButton
            advise={'Please define the graph template by specifing triples.'}
          ></HelpButton>
        </h4>
        <div className="flex">
          {(
            this.state.query.constructTemplate || [
              { subject: '?s', predicate: '?p', object: '?o' },
            ]
          ).map((templateRow, i) => (
            <TripleInput
              key={i}
              index={0}
              triple={templateRow}
              autocompleteProperty={[]}
              autocompleteFilterValue={[]}
              onRemove={function (index: number): void {
                throw new Error('Function not implemented.');
              }}
              onChange={this.updateConstructTemplate(i)}
            ></TripleInput>
          ))}
        </div>
      </div>
    );
  }

  private toggleColumnSelection(variable: string, selected: boolean): void {
    const selectColumns = this.state.query.selectColumns || [
      ...this.state.variables,
    ];
    if (selected) {
      selectColumns.push(variable);
    } else {
      selectColumns.splice(selectColumns.indexOf(variable), 1);
    }
    this.setState(
      { ...this.state, query: { ...this.state.query, selectColumns } },
      () => {
        console.log(this.state);
        this.buildQuery();
      }
    );
  }

  private includeColumnSelector(): JSX.Element {
    return (
      <div>
        <h4 className="font-bold mb-2 relative z-10">
          Columns{' '}
          <HelpButton
            advise={'Please select the variables to be shown in the table.'}
          ></HelpButton>
        </h4>
        <div className="flex">
          {this.state.variables.map((v, i) => (
            <div className="flex items-start mr-6" key={i}>
              <div className="flex items-center h-5">
                <input
                  name={`selectVar_${i}`}
                  checked={(
                    this.state.query.selectColumns || this.state.variables
                  ).includes(v)}
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  onChange={(event) =>
                    this.toggleColumnSelection(v, event.target.checked)
                  }
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`selectVar_${i}`}
                  className="font-medium text-gray-700"
                >
                  {v}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private includeQueryModifiers(): JSX.Element {
    return (
      <QueryModifiers
        modifiers={this.state.query.modifiers}
        onChange={this.handleModifierChange}
      ></QueryModifiers>
    );
  }

  private includePropertyFilter(): JSX.Element {
    const add = () => {
      const list = this.state.propertiesFilter || [];
      list.push({ subject: '', predicate: '', object: '' });
      this.setState({ ...this.state, propertiesFilter: list });
    };
    const remove = (index: number) => {
      const list = this.state.propertiesFilter || [];
      list.splice(index, 1);
      this.setState({ ...this.state, propertiesFilter: list });
    };
    return (
      <div>
        <h4 className="font-bold mb-2 relative z-10">
          Show entries where...{' '}
          <HelpButton
            advise={
              'In this section you may define filters for the data to be returned. Each line consists of a subject, property and the property value that must be matched.'
            }
          ></HelpButton>
        </h4>
        {this.state.propertiesFilter?.map((pF, i) => (
          <TripleInput
            key={i}
            index={i}
            triple={pF}
            onChange={this.handlePropertyFilterChange(i)}
            onRemove={() => remove(i)}
            autocompleteProperty={[]}
            autocompleteFilterValue={[]}
          ></TripleInput>
        ))}
        <button
          type="button"
          onClick={() => add()}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </div>
    );
  }
}

export default AdvancedEditor;
