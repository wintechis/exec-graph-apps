export interface TabBarProps<T> {
  selected?: T;
  options: { value: T; label: string }[];
  onChange: (selected: T) => void;
}

export function TabBar<T>(props: TabBarProps<T>) {
  return (
    <div className="flex px-4">
      {props.options.map((option, index) => (
        <button
          type="button"
          key={option.label}
          onClick={() => props.onChange(option.value)}
          className={
            'px-6 py-2' +
            (option.value === props.selected
              ? ' bg-gray-200 font-bold text-fau-blue'
              : '')
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TabBar;
