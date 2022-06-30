/**
 * Type definition of mandatory and optional properties of the {@link DescribeTargets} component
 */
export interface DescribeTargetsProps {
  /**
   * RDF URIs of object to describe
   */
  targets: string[];
  onChange: (targets: string[]) => void;
}

/**
 * UI form element to for list of RDF Uris to include in a DESCRIBE query
 * @category React component
 */
export function DescribeTargets(props: DescribeTargetsProps): JSX.Element {
  /**
   * Event handler factory to update target uri
   * @param index the index in the list of targets to update
   */
  const updateDescribeTarget = (index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      const targets = props.targets;
      targets[index] = event.target.value;
      props.onChange(targets);
    };
  };
  /**
   * Adds a new empty input field
   */
  const add = () => {
    const targets = props.targets;
    targets.push('');
    props.onChange(targets);
  };
  /**
   * removes input field
   *
   * @param index index of the field in the list of targets
   */
  const remove = (index: number) => {
    const targets = props.targets;
    targets.splice(index, 1);
    props.onChange(targets);
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Show details of...</h4>
      {props.targets?.map((t, i) => (
        <div key={i} className="flex items-end mb-4">
          <div className="grow mr-2">
            <label
              htmlFor="propertyFilterValue_0"
              className="block text-sm font-medium text-gray-700"
            >
              Object URI #{i}
            </label>
            <input
              name="propertyFilterValue_0"
              value={t}
              onChange={updateDescribeTarget(i)}
              className="grow shadow-sm mt-1 bg-white block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            ></input>
          </div>
          <div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="inline-flex justify-center py-2 px-4 border border-fau-red shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => add()}
        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add
      </button>
    </div>
  );
}

export default DescribeTargets;
