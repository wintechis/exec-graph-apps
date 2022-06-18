import {
  FetchHttpClient,
  HttpClient,
  HttpSparqlRepository,
  RemoteDataSource,
} from '@exec-graph/graph/data-source-remote';
import { DataSet, DataSource } from '@exec-graph/graph/types';
import { Component } from 'react';
import { detailQuery, wikidataQuery } from './detail-view-queries';
import { DetailView as WrappedDetailView } from '@exec-graph/detail-view';
import LoadingBar, { LoadingStatus, Step } from '../loading-bar/loading-bar';

/**
 * URL of the WikiData Sparql Endpoint for automatic queries
 */
const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

/**
 * This attribute defines the field in which the WikiData Property is defined
 *
 * Note: In theory this field could point to an arbitrary
 * source, not only wikidata. However, at the current time
 * all ExecGraph entities only refer to wikidata so we kept
 * the code simple.
 */
const WIKIDATA_JOIN_ATTRIBUTE = 'http://schema.org/sameAs';

export interface DetailViewProps {
  selectedObject: string;
  data?: DataSet;
  mainDataSource: DataSource;
  onSelect: (selectedObject: string) => void;
}

interface DetailViewState {
  detailsStatus: LoadingStatus;
  wikidataStatus: LoadingStatus;
  data?: DataSet;
}

/**
 * Loads the right data and displays it in the
 * wrapped DetailView component
 *
 * In particular it deals with loading all details
 * and the addition of wikidata contents
 *
 * @category React Component
 */
export class DetailView extends Component<DetailViewProps, DetailViewState> {
  private wikidataDataSource: RemoteDataSource;

  constructor(props: DetailViewProps) {
    super(props);
    this.state = {
      data: this.props.data,
      detailsStatus: LoadingStatus.NOT_STARTED,
      wikidataStatus: LoadingStatus.NOT_STARTED,
    };
    this.wikidataDataSource = this.initRemoteSource(WIKIDATA_SPARQL_ENDPOINT);
    this.loadDetails();
  }

  override componentDidUpdate(prevProps: Readonly<DetailViewProps>) {
    if (this.props.selectedObject !== prevProps.selectedObject) {
      this.setState(
        {
          data: this.props.data,
          detailsStatus: LoadingStatus.NOT_STARTED,
          wikidataStatus: LoadingStatus.NOT_STARTED,
        },
        () => this.loadDetails()
      );
    }
  }

  private initRemoteSource(source: string) {
    const httpClient: HttpClient = new FetchHttpClient();
    return new RemoteDataSource(new HttpSparqlRepository(source, httpClient));
  }

  /**
   * Loads the data from the different sources
   */
  private loadDetails(): void {
    const selected = this.props.selectedObject;
    if (selected == null) {
      return;
    }
    this.setState({
      ...this.state,
      detailsStatus: LoadingStatus.PENDING,
    });
    this.props.mainDataSource
      .getForSparql(detailQuery(selected))
      .then((ds) => {
        this.setState(
          {
            ...this.state,
            detailsStatus: LoadingStatus.LOADED,
            data: ds,
          },
          () => this.resolveWikiDataFor(selected, ds)
        );
      })
      .catch(() =>
        this.setState({ ...this.state, detailsStatus: LoadingStatus.ERROR })
      );
  }

  private resolveWikiDataFor(selected: string, { graph }: DataSet): void {
    if (
      !graph?.hasNode(selected) ||
      !graph?.getNodeAttribute(selected, WIKIDATA_JOIN_ATTRIBUTE)
    ) {
      // no join information is available to base a wikidata query on
      this.setWikiDataStatus(LoadingStatus.SKIPPED);
      return;
    }
    this.setWikiDataStatus(LoadingStatus.PENDING);
    const sameAs = graph?.getNodeAttribute(selected, WIKIDATA_JOIN_ATTRIBUTE);
    this.wikidataDataSource
      .addInformation(graph, wikidataQuery(selected, sameAs))
      .then((ds) =>
        this.setState({
          ...this.state,
          wikidataStatus: LoadingStatus.LOADED,
          data: ds,
        })
      )
      .catch(() => this.setWikiDataStatus(LoadingStatus.ERROR));
  }

  private setWikiDataStatus(wikidataStatus: LoadingStatus) {
    this.setState({
      ...this.state,
      wikidataStatus,
    });
  }

  public override render() {
    return (
      <div className="bg-white pt-4">
        <LoadingBar steps={this.currentProgress()}></LoadingBar>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
          {this.state.data ? (
            <WrappedDetailView
              data={this.state.data}
              selectedObject={this.props.selectedObject}
              schema={this.state.data?.schema}
              onSelect={this.props.onSelect}
            ></WrappedDetailView>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <p>Loading details of</p>
              <h3 className="font-bold">{this.props.selectedObject}</h3>
            </div>
          )}
        </div>
      </div>
    );
  }

  private currentProgress(): Step[] {
    return [
      {
        name: 'Graph Data',
        width: '1/6',
        status: LoadingStatus.LOADED,
      },
      {
        name: 'All Details',
        width: '3/6',
        status: this.state.detailsStatus,
      },
      {
        name: 'WikiData.org',
        width: '2/6',
        status: this.state.wikidataStatus,
      },
    ];
  }
}

export default DetailView;
