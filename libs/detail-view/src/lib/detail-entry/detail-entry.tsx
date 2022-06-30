/**
 * Type definition of mandatory and optional properties of the {@link DetailEntry} component
 */
export interface DetailEntryProps {
  label: string | number | JSX.Element;
  value: string | number | JSX.Element;
}

/**
 * Renders the row of a details list (one label + one value)
 *
 * @category React Component
 */
export function DetailEntry(props: DetailEntryProps): JSX.Element {
  return (
    <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-500 break-all">{props.label}</dt>
      <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 break-all">
        {props.value}
      </dd>
    </div>
  );
}

export default DetailEntry;
