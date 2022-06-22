export interface ButtonToggleProps<T> {
  label?: string;
  selected?: T;
  options: { value: T; label: string }[];
  onChange: (selected: T) => void;
  className?: string;
}

export function ButtonToggle<T>(props: ButtonToggleProps<T>) {
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
