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

/**
 * Type definition of mandatory and optional properties of the {@link DetailView} component
 */
export interface DetailViewProps {
  selectedObject: string;
  data?: DataSet;
  mainDataSource: DataSource;
  onSelect: (selectedObject: string) => void;
}

/**
 * Type definition of internal state of the {@link TableView} component
 */
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
  private wikidataDataSource: DataSource;

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

  override componentDidUpdate(prevProps: Readonly<DetailViewProps>): void {
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

  /**
   * Provides a {@link DataSource} instance for the passed endpoint
   *
   * @param endpoint url of the sparql endpoint
   * @returns the {@link DataSource} instance
   */
  private initRemoteSource(endpoint: string): DataSource {
    const httpClient: HttpClient = new FetchHttpClient();
    return new RemoteDataSource(new HttpSparqlRepository(endpoint, httpClient));
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

  /**
   * Checks if the selected object is linked to a WikiData object and makes a request to the WikiData endpoint if so. The returned data is added to the loaded graph.
   *
   * @param selected the uri of the object to load details for
   * @param graph a graph which contains details for the selected object
   */
  private resolveWikiDataFor(selected: string, { graph }: DataSet): void {
    if (
      !graph?.hasNode(selected) ||
      !graph?.getNodeAttribute(selected, WIKIDATA_JOIN_ATTRIBUTE)
    ) {
      // no join information is available to base a wikidata query on
      this.setStatusOfWikiDataRequest(LoadingStatus.SKIPPED);
      return;
    }
    this.setStatusOfWikiDataRequest(LoadingStatus.PENDING);
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
      .catch(() => this.setStatusOfWikiDataRequest(LoadingStatus.ERROR));
  }

  /**
   * Updates the progress of the wikidata request
   *
   * @param wikidataStatus the new status
   */
  private setStatusOfWikiDataRequest(wikidataStatus: LoadingStatus): void {
    this.setState({
      ...this.state,
      wikidataStatus,
    });
  }

  public override render(): JSX.Element {
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

  /**
   * Converts the loading progress from the state to a list supported by the progress bar component.
   *
   * @returns list of steps to be passed to the progress bar component
   */
  private currentProgress(): Step[] {
    return [
      {
        name: 'Graph Data',
        width: 'w-1/6',
        status: LoadingStatus.LOADED,
      },
      {
        name: 'All Details',
        width: 'w-3/6',
        status: this.state.detailsStatus,
      },
      {
        name: 'WikiData.org',
        width: 'w-2/6',
        status: this.state.wikidataStatus,
      },
    ];
  }
}

export default DetailView;
