import { LoadingStatus, Step } from '../types';

/**
 * Maps a {@link LoadingStatus} value to a human friendly label
 *
 * @param status the value to be mapped
 * @returns human name of loading status
 */
function loadingStatusLabel(status: LoadingStatus): string {
  switch (status) {
    case LoadingStatus.NOT_STARTED:
      return '(Not Started)';
    case LoadingStatus.PENDING:
      return '(Pending)';
    case LoadingStatus.LOADED:
      return '(Done)';
    case LoadingStatus.ERROR:
      return '(Failed)';
    case LoadingStatus.SKIPPED:
      return '(Skipped)';
    default:
      return '';
  }
}

/**
 * Maps a {@link LoadingStatus} value to a css class to style the bar element with
 *
 * @param status the value to be mapped
 * @returns css class(es)
 */
function loadingStatusCssClass(status: LoadingStatus): string {
  switch (status) {
    case LoadingStatus.NOT_STARTED:
      return 'bg-blue-300';
    case LoadingStatus.PENDING:
      return 'bg-fau-blue text-white motion-safe:animate-pulse';
    case LoadingStatus.LOADED:
      return 'bg-green-500';
    case LoadingStatus.ERROR:
      return 'bg-fau-red text-white';
    case LoadingStatus.SKIPPED:
      return 'bg-gray-300';
    default:
      return 'bg-gray-300';
  }
}

/**
 * Type definition of mandatory and optional properties of the {@link LoadingBar} component
 */
export interface LoadingBarProps {
  steps: Step[];
}

/**
 * Renders a progress bar to indicate loading status
 *
 * @category React Component
 */
export function LoadingBar(props: LoadingBarProps): JSX.Element {
  return (
    <div className="group mt-2">
      <div className="h-1 group-hover:h-auto flex text-[0px] group-hover:text-xs motion-safe:transition-all">
        {props.steps.map((step, index) => (
          <div
            key={index}
            className={
              `${step.width} transition-all group-hover:p-1 ` +
              loadingStatusCssClass(step.status) +
              (index > 0 ? ' border-l' : '')
            }
          >
            {step.name} {loadingStatusLabel(step.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingBar;
