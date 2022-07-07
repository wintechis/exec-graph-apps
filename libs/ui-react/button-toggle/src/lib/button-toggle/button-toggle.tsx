/**
 * Type definition of mandatory and optional properties of the {@link ButtonToggle} component
 */
export interface ButtonToggleProps<T> {
  /**
   * Optional label to show before the first button
   */
  label?: string;
  /**
   * The current value to be highlight
   */
  selected?: T;
  /**
   * list of all options to show
   */
  options: { value: T; label: string }[];
  /**
   * Invoked when the user toggled to a different value
   */
  onChange: (selected: T) => void;
  /**
   * CSS classes to attach to the element
   */
  className?: string;
}

/**
 * Creates a button styled radio-button like toggle group.
 *
 * @category React Component
 */
export function ButtonToggle<T>(props: ButtonToggleProps<T>): JSX.Element {
  const label = props.label ? (
    <div className="p-2 bg-gray-100 rounded-l-md">{props.label}</div>
  ) : null;
  return (
    <div
      className={`border border-gray-400 rounded-md flex ${props.className}`}
    >
      {label}
      {props.options.map((option, index) => (
        <button
          type="button"
          key={option.label}
          onClick={() => props.onChange(option.value)}
          className={
            'p-2 px-4 border-gray-400 bg-white' +
            (option.value === props.selected ? ' bg-fau-blue text-white' : '') +
            (index === props.options.length - 1 ? ' rounded-r-md' : '') +
            (index === 0 && !props.label ? ' rounded-l-md' : ' border-l')
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ButtonToggle;
