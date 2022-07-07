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
              step.status +
              (step.status === LoadingStatus.PENDING
                ? ' motion-safe:animate-pulse'
                : '') +
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
