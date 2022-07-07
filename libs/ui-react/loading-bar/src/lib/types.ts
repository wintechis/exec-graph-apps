/**
 * Indicates the status of a progress step.
 *
 * Also deals with coloring the element in the right color
 */
export enum LoadingStatus {
  NOT_STARTED = 'bg-blue-300',
  PENDING = 'bg-fau-blue text-white',
  LOADED = 'bg-green-500',
  ERROR = 'bg-fau-red text-white',
  SKIPPED = 'bg-gray-300',
}

/**
 * Defines on element in the progress bar
 */
export interface Step {
  name: string;
  status: LoadingStatus;
  width: 'w-1/6' | 'w-2/6' | 'w-3/6' | 'w-4/6' | 'w-5/6';
}
