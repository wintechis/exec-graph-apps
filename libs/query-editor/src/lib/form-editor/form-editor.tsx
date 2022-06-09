import { DataSource } from '@exec-graph/graph/types';
import { ButtonToggle } from '@exec-graph/ui-react/button-toggle';
import { Component } from 'react';
import { Generator, Parser, SparqlQuery } from 'sparqljs';
import DescribeTargets from '../describe-targets/describe-targets';
import QueryModifiers from '../query-modifiers/query-modifiers';
import {
  Modifiers,
  QueryBuilder,
  SparqlQueryType,
} from '../query-modifiers/query.types';

/**
 * This query returns all properties used in a dataset (not only delcared ones)
 *
 * Taken from: https://sparql-playground.sib.swiss/faq
 */
const QUERY_SELECT_PROPERTIES = `
   SELECT DISTINCT ?property
   WHERE
   { ?s ?property ?o . }
 `;

export interface FormEditorProps {
  dataSource: DataSource;
  sparql: string;
  onChange: (sparql: string) => void;
}

interface FormEditorState {
  sparql: string;
  queryType: SparqlQueryType;
  properties?: string[];
  propertiesFilter?: { predicate: string; object: string; subject: string }[];
  query: {
    modifiers: Modifiers;
    describeTargets?: string[];
  };
}

const DEFAULT_STATE: FormEditorState = {
  sparql: '',
  queryType: 'SELECT',
  propertiesFilter: [{ predicate: '?p', object: '?o', subject: '?s' }],
  query: {
    describeTargets: [''],
    modifiers: { orderByDir: '', orderBy: null, limit: null, offset: null },
  },
};

/**
 * UI Element that offers a user different filter options,
 * the input will be converted to a sparql query
 *
 * Filter by class, property values, general string match?
 *
 * @category React Component
 */
export class FormEditor extends Component<FormEditorProps, FormEditorState> {
  constructor(props: Readonly<FormEditorProps>) {
    super(props);
    this.state = { ...DEFAULT_STATE, sparql: props.sparql };
    this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handlePropertyValueChange = this.handlePropertyValueChange.bind(this);
    this.handlePropertySubjectChange =
      this.handlePropertySubjectChange.bind(this);
    this.handleDescribeTargetsChange =
      this.handleDescribeTargetsChange.bind(this);
    this.handleModifierChange = this.handleModifierChange.bind(this);

    this.setStateFromSparql(this.props.sparql);
  }

  public override componentDidMount(): void {
    this.setStateFromSparql(this.props.sparql);
    this.props.dataSource.getForSparql(QUERY_SELECT_PROPERTIES).then((data) => {
      this.setState({
        ...this.state,
        properties: data.tabular?.data?.map((row) => row['property'].value),
      });
    });
  }

  public override componentDidUpdate(
    _prevProps: Readonly<FormEditorProps>,
    prevState: Readonly<FormEditorState>
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
      throw Error('unsupported query');
    }
    //@ts-ignore
    const orderByTerm = parsed['order']?.[0]?.['expression'];
    const modifiers: Modifiers = {
      //@ts-ignore
      limit: parsed['limit'] || null,
      //@ts-ignore
      offset: parsed['offset'] || null,
      orderBy:
        orderByTerm?.termType === 'Variable'
          ? '?' + orderByTerm['value']
          : null,
      //@ts-ignore
      orderByDir: parsed['order']?.[0]
        ? //@ts-ignore
          parsed['order'][0]['descending'] === true
          ? 'DESCENDING'
          : 'ASCENDING'
        : '',
    };
    let describeTargets = [];
    if (parsed.queryType === 'DESCRIBE') {
      describeTargets = parsed.variables
        //@ts-ignore
        .filter((t) => t.type === 'NamedNode')
        //@ts-ignore
        .map((t) => t.value);
    }

    this.setState({
      ...this.state,
      queryType: parsed.queryType,
      sparql: sparql,
      query: {
        modifiers,
        describeTargets,
      },
    });
  }

  private buildQuery(): void {
    const queryBuilder = new QueryBuilder(this.state.queryType);
    if (
      this.state.queryType === 'SELECT' ||
      this.state.queryType === 'CONSTRUCT'
    ) {
      const variables: object[] = [];
      const wherePropertiesMatchTriples: object[] = [];
      this.state.propertiesFilter?.forEach((propFilter) => {
        const triple = {
          subject: QueryBuilder.term(propFilter.subject),
          predicate: QueryBuilder.term(propFilter.predicate),
          object: QueryBuilder.term(propFilter.object),
        };
        wherePropertiesMatchTriples.push(triple);
        if (triple.subject.termType === 'Variable') {
          variables.push(triple.subject);
        }
        if (triple.predicate.termType === 'Variable') {
          variables.push(triple.predicate);
        }
        if (triple.object.termType === 'Variable') {
          variables.push(triple.object);
        }
      });
      queryBuilder.select(variables);
      queryBuilder.addWhereTriples(wherePropertiesMatchTriples);
      queryBuilder.addModifiers(this.state.query.modifiers);
    }
    if (
      this.state.queryType === 'DESCRIBE' &&
      this.state.query.describeTargets
    ) {
      queryBuilder.addDescribeTargets(this.state.query.describeTargets);
    }

    const generator = new Generator();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sparql = generator.stringify(queryBuilder.getQuery());
    this.setState({ ...this.state, sparql });
    this.props.onChange(sparql);
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

  private handlePropertyChange(index: number) {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const propertiesFilter = this.state.propertiesFilter || [];
      propertiesFilter[index] = {
        subject: propertiesFilter[index]?.subject || '?s',
        predicate: event.target.value,
        object: '',
      };
      this.setState(
        {
          ...this.state,
          propertiesFilter,
        },
        () => this.buildQuery()
      );
    };
  }

  private handlePropertyValueChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const propertiesFilter = this.state.propertiesFilter || [];
      propertiesFilter[index] = {
        ...propertiesFilter[index],
        object: event.target.value,
      };
      this.setState(
        {
          ...this.state,
          propertiesFilter,
        },
        () => this.buildQuery()
      );
    };
  }

  private handlePropertySubjectChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const propertiesFilter = this.state.propertiesFilter || [];
      propertiesFilter[index] = {
        ...propertiesFilter[index],
        subject: event.target.value,
      };
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
    let querySpecificFields = null;
    if (
      this.state.queryType === 'SELECT' ||
      this.state.queryType === 'CONSTRUCT'
    ) {
      querySpecificFields = (
        <>
          <div>
            <h4 className="font-bold mb-2">Show entries where...</h4>
            <div className="flex flex-wrap mb-4">
              <div className="w-24 mr-2">
                <label
                  htmlFor="propertyFilterSubject_0"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  name="propertyFilterSubject_0"
                  value={this.state.propertiesFilter?.[0]?.subject}
                  onChange={this.handlePropertySubjectChange(0)}
                  className="grow shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                ></input>
              </div>
              <div className="mr-2">
                <label
                  htmlFor="propertySelect_0"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property
                </label>
                <select
                  name="propertySelect_0"
                  value={this.state.propertiesFilter?.[0]?.predicate}
                  onChange={this.handlePropertyChange(0)}
                  className="shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                >
                  <option value="?p">?p</option>
                  {this.state.properties?.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grow">
                <label
                  htmlFor="propertyFilterValue_0"
                  className="block text-sm font-medium text-gray-700"
                >
                  Matches
                </label>
                <input
                  name="propertyFilterValue_0"
                  value={this.state.propertiesFilter?.[0]?.object}
                  onChange={this.handlePropertyValueChange(0)}
                  className="grow shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                ></input>
              </div>
            </div>
          </div>
          <QueryModifiers
            modifiers={this.state.query.modifiers}
            onChange={this.handleModifierChange}
          ></QueryModifiers>
        </>
      );
    }
    if (this.state.queryType === 'DESCRIBE') {
      querySpecificFields = (
        <DescribeTargets
          targets={this.state.query.describeTargets || []}
          onChange={this.handleDescribeTargetsChange}
        ></DescribeTargets>
      );
    }

    return (
      <div className="px-4 py-5 space-y-6 sm:p-6">
        <div className="flex mb-4">
          <ButtonToggle
            selected={this.state.queryType}
            onChange={this.handleQueryTypeChange}
            options={[
              { label: 'Graph (CONSTRUCT)', value: 'CONSTRUCT' },
              { label: 'Tabular (SELECT)', value: 'SELECT' },
              { label: 'Focus (DESCRIBE)', value: 'DESCRIBE' },
            ]}
          ></ButtonToggle>
        </div>
        {querySpecificFields}

        <div className="mt-4 pt-2 border-t">
          <label
            htmlFor="sparql"
            className="block text-sm font-medium text-gray-700"
          >
            Generated SPARQL Query
          </label>
          <textarea
            name="sparql"
            readOnly={true}
            rows={3}
            value={this.props.sparql}
            className="shadow-sm mt-1 bg-gray-200 text-gray-600 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    );
  }
}

export default FormEditor;
