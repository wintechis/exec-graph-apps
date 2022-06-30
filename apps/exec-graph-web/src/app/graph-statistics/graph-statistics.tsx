import { HttpError } from '@exec-graph/graph/data-source-remote';
import { DataSet, DataSource } from '@exec-graph/graph/types';
import { Component } from 'react';

const CLASS_COUNTS_QUERY = `SELECT ?class (count(?instance) as ?numberOfInstances) 
WHERE {
    ?instance a ?class .
}
group by ?class
order by desc(?numberOfInstances)`;

/**
 * List of RDF classes which should be included in the statistical overview
 *
 * Includes label and icon for each
 */
const HIGHLIGHT_CLASSES = [
  { uri: 'http://schema.org/Person', label: 'People', icon: '👤' },
  { uri: 'http://schema.org/Organization', label: 'Organisations', icon: '🏭' },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#DAXmember',
    label: 'DAX Members',
    icon: '🏢',
  },
  {
    uri: 'http://schema.org/EmployeeRole',
    label: 'Positions (Relationships between a person and organisation)',
    icon: '💼',
  },
  {
    uri: 'http://schema.org/CollegeOrUniversity',
    label: 'Educational Institutions',
    icon: '🏫',
  },
  {
    uri: 'http://schema.org/EducationalOccupationalProgram',
    label: 'Alumni Associations (Educational credentials awarded)',
    icon: '🎓',
  },
  { uri: 'http://schema.org/City', label: 'Cities', icon: '🏙️' },
  { uri: 'http://schema.org/TradeAction', label: 'Dealings', icon: '📈' },
];

/**
 * Type definition of mandatory and optional properties of the {@link GraphStatistics} component
 */
export interface GraphStatisticsProps {
  dataSource: DataSource;
}

/**
 * Queries the given data source for some statistical data and displays it nicely.
 *
 * @category React Component
 */
export class GraphStatistics extends Component<
  GraphStatisticsProps,
  {
    data?: DataSet;
    error?: { message: string };
  }
> {
  constructor(props: GraphStatisticsProps) {
    super(props);
    this.state = {};
  }

  /**
   * Initiate query to datasource upon adding the widget to the component tree
   */
  public override componentDidMount(): void {
    this.props.dataSource
      .getForSparql(CLASS_COUNTS_QUERY)
      .then((ds) =>
        this.setState({
          data: ds,
        })
      )
      .catch((e) => {
        if (e instanceof HttpError) {
          this.setState({ error: { message: e.message } });
          return;
        }
        throw e;
      });
  }

  /**
   * Extracts the count for an uri from the query results
   *
   * @returns number as string or undefined if query did not complete
   */
  private getCountOf(classUri: string): string | undefined {
    return this.state.data?.tabular?.data.find(
      (row) => row['class'].value === classUri
    )?.['numberOfInstances'].value;
  }

  /**
   * If an error occured, add a error message to the component tree
   *
   * @returns the error message or null
   */
  private insertErrorMessage(): JSX.Element | null {
    if (this.state.error) {
      return (
        <div className="text-fau-red text-center">
          Sorry, we encountered an error while loading the statistics:{' '}
          {this.state.error.message}
        </div>
      );
    }
    return null;
  }

  /**
   * Renders the classes and their respective counts
   *
   * @returns widget to be included in a page
   */
  public override render(): JSX.Element {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {HIGHLIGHT_CLASSES.map((highlight) => (
            <div className="p-4 py-8" key={highlight.uri}>
              <div className="text-4xl font-bold text-center">
                {highlight.icon} {this.getCountOf(highlight.uri) || '---'}
              </div>
              <div className="mt-2 text-center">{highlight.label}</div>
            </div>
          ))}
        </div>
        {this.insertErrorMessage()}
      </div>
    );
  }
}

export default GraphStatistics;
