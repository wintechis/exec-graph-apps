/**
 * Indicates the status of a progress step.
 *
 * Also deals with coloring the element in the right color
 */
export enum LoadingStatus {
  NOT_STARTED,
  PENDING,
  LOADED,
  ERROR,
  SKIPPED,
}

/**
 * Defines on element in the progress bar
 */
export interface Step {
  name: string;
  status: LoadingStatus;
  width: 'w-1/6' | 'w-2/6' | 'w-3/6' | 'w-4/6' | 'w-5/6';
}
