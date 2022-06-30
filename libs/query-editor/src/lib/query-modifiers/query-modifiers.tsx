import { Modifiers } from './query.types';

/**
 * Type definition of mandatory and optional properties of the {@link QueryModifiers} component
 */
export interface QueryModifiersProps {
  modifiers: Modifiers;
  onChange: (modifiers: Modifiers) => void;
}

/**
 * Displays form elements to configure query modifiers
 *
 * Includes: Order, Limit and Offset
 *
 * @category React component
 */
export function QueryModifiers(props: QueryModifiersProps): JSX.Element {
  const onChange = (mod: keyof Modifiers) => {
    return (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const modifiers = props.modifiers;
      if (mod === 'orderBy') {
        modifiers[mod] =
          event.target.value !== null ? event.target.value : null;
      } else if (mod === 'orderByDir') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        modifiers[mod] = event.target.value;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        modifiers[mod] =
          event.target.value !== null ? +event.target.value : null;
      }
      props.onChange(modifiers);
    };
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Result Modifiers</h4>
      <div className="flex flex-wrap mb-4">
        <div className="grow mr-2">
          <label
            htmlFor="modOrder"
            className="block text-sm font-medium text-gray-700"
          >
            Order by
          </label>
          <div className="mt-1 shadow-sm bg-white h-10 border border-gray-300 rounded-md">
            <select
              name="modOrder"
              value={props.modifiers.orderByDir || ''}
              onChange={onChange('orderByDir')}
              className="w-2/5 lg:w-1/4 sm:text-sm rounded-l-md p-2 bg-white"
            >
              <option value="">Disabled</option>
              <option value="DESCENDING">Descending</option>
              <option value="ASCENDING">Ascending</option>
            </select>
            <input
              name="modOrder"
              value={props.modifiers.orderBy || ''}
              onChange={onChange('orderBy')}
              className="w-3/5 lg:w-3/4 sm:text-sm border-l border-gray-300 rounded-r-md p-2"
            ></input>
          </div>
        </div>
        <div className="mr-2 grow">
          <label
            htmlFor="modLimit"
            className="block text-sm font-medium text-gray-700"
          >
            Show # entries (Limit)
          </label>
          <input
            name="modLimit"
            type="number"
            value={String(props.modifiers.limit)}
            onChange={onChange('limit')}
            className="h-10 shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          ></input>
        </div>
        <div className="grow">
          <label
            htmlFor="modOffset"
            className="block text-sm font-medium text-gray-700"
          >
            Start with entry # (Offset)
          </label>
          <input
            name="modOffset"
            type="number"
            value={String(props.modifiers.offset)}
            onChange={onChange('offset')}
            className="h-10 shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          ></input>
        </div>
      </div>
    </div>
  );
}

export default QueryModifiers;
