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
 * Defines on element in the progress bar
 */
export interface Step {
  name: string;
  status: LoadingStatus;
  width: 'w-1/6' | 'w-2/6' | 'w-3/6' | 'w-4/6' | 'w-5/6';
}

export interface LoadingBarProps {
  steps: Step[];
}

/**
 * Renders a progress bar to indicate loading status
 *
 * @category React Component
 */
export function LoadingBar(props: LoadingBarProps) {
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
