/**
 * Indicates the status of a progress step.
 *
 * Also deals with coloring the element in the right color
 */
export enum LoadingStatus {
  NOT_STARTED = 'bg-blue-300',
  PENDING = 'bg-fau-blue',
  LOADED = 'bg-green-500',
  ERROR = 'bg-fau-red',
  SKIPPED = 'bg-gray-300',
}

/**
 * Defines on element in the progress bar
 */
export interface Step {
  name: string;
  status: LoadingStatus;
  width: string;
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
    <div className="group mb-2">
      <div className="h-1 group-hover:h-auto flex text-[0px] group-hover:text-xs motion-safe:transition-all">
        {props.steps.map((step, index) => (
          <div
            key={index}
            className={
              `w-${step.width} transition-all group-hover:p-1 ` +
              step.status +
              (step.status === LoadingStatus.PENDING
                ? ' motion-safe:animate-pulse'
                : '') +
              (index > 0 ? ' border-l' : '')
            }
          >
            {step.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingBar;
