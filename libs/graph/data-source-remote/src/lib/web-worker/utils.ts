import { DataSet, RdfValue, Schema } from '@exec-graph/graph/types';
import Graph from 'graphology';
import { SerializedGraph } from 'graphology-types';

/**
 * DataSet variant that can be transfered via worker messages
 */
interface SerializedDataSet {
  graph?: SerializedGraph;
  schema: Schema;
  tabular?: {
    headers: string[];
    data: { [varkey: string]: RdfValue }[];
  };
}

/**
 * Dehydrates the dataset since the graphology instance
 * within the dataset can not be passed via message events
 *
 * @param dataset the dataset as it was returned by the wrapped DataSource
 * @returns the dataset as it can be passed via the message
 */
export function dehydrateDataset(dataset: DataSet): SerializedDataSet {
  if (dataset.graph != null) {
    return { ...dataset, graph: dataset.graph.export() };
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Because we check for graph before, its not possible to be wrong here
  return dataset;
}

/**
 * Hydrates a dataset from a message since the graphology instance
 * within the dataset can not be passed via message events
 *
 * @param dataset the dehydrated dataset
 * @returns the dataset as it can be passed via the message
 */
export function hydrateDataset(dataset: SerializedDataSet): DataSet {
  if (dataset.graph) {
    return { ...dataset, graph: Graph.from(dataset.graph) };
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Because we check for graph before, its not possible to be wrong here
  return dataset;
}
