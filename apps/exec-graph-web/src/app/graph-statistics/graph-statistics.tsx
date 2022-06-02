import { HttpError } from '@exec-graph/graph/data-source-remote';
import { DataSet, DataSource } from '@exec-graph/graph/types';
import { Component } from 'react';

const CLASS_COUNTS_QUERY = `SELECT ?class (count(?instance) as ?numberOfInstances) 
WHERE {
    ?instance a ?class .
}
group by ?class
order by desc(?numberOfInstances)`;

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
    label: 'Positions (Person employed at a Company)',
    icon: '💼',
  },
  {
    uri: 'http://schema.org/CollegeOrUniversity',
    label: 'Educational Institutions',
    icon: '🏫',
  },
  {
    uri: 'http://schema.org/EducationalOccupationalProgram',
    label: 'Alumni Associations (Person studied at a University)',
    icon: '🎓',
  },
  { uri: 'http://schema.org/City', label: 'Cities', icon: '🏙️' },
  { uri: 'http://schema.org/TradeAction', label: 'Dealings', icon: '📈' },
];

export interface GraphStatisticsProps {
  dataSource: DataSource;
}

/**
 * Queries
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

  private getCountOf(classUri: string): string | undefined {
    return this.state.data?.tabular?.data.find(
      (row) => row['class'].value === classUri
    )?.['numberOfInstances'].value;
  }

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

  public override render() {
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
