import { Query } from '@exec-graph/explorer/types';
import { useEffect, useState } from 'react';

function query(classFilter: string) {
  return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX schema: <http://schema.org/>
      
CONSTRUCT {?s ?p ?o}
WHERE {
  ?s ?p ?o.
  ?s rdf:type ?c.
  FILTER (?c IN ( ${classFilter} ) )
}`;
}

/**
 * Type definition of mandatory and optional properties of the {@link SimpleEditor} component
 */
export interface SimpleEditorProps {
  /**
   * The current sparql to be edited, can be an empty string
   */
  sparql: string;
  /**
   * Triggered when the user changed the sparql query
   */
  onChange: (query: Query) => void;
}

interface Option {
  uri: string;
  label: string;
  selected: boolean;
}

/**
 * List of ExecGraph specific RDF classes to filter by
 */
const EXEC_GRAPH_CLASSES: Option[] = [
  { uri: 'http://schema.org/Person', label: 'People', selected: false },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#SupervisoryBoardMember',
    label: 'Supervisory Board Members',
    selected: false,
  },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#ManagementBoardMember',
    label: 'Management Board Members',
    selected: false,
  },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#Auditor',
    label: 'Auditors',
    selected: false,
  },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#CEO',
    label: 'CEOs',
    selected: false,
  },
  { uri: 'http://schema.org/EmployeeRole', label: 'Position', selected: false },
  { uri: 'http://schema.org/TradeAction', label: 'Dealings', selected: false },
  {
    uri: 'http://schema.org/Organization',
    label: 'Organisations',
    selected: false,
  },
  {
    uri: 'https://solid.ti.rw.fau.de/public/2021/execgraph/class.ttl#DAXmember',
    label: 'DAX Members',
    selected: false,
  },
  { uri: 'http://schema.org/Review', label: 'Audits', selected: false },
  { uri: 'http://schema.org/City', label: 'Cities', selected: false },
  {
    uri: 'http://schema.org/CollegeOrUniversity',
    label: 'Higher Education Institutes',
    selected: false,
  },
  {
    uri: 'http://schema.org/EducationalOccupationalProgram',
    label: 'Educations',
    selected: false,
  },
];

export function SimpleEditor(props: SimpleEditorProps) {
  const [classes, setClasses] = useState(EXEC_GRAPH_CLASSES);

  useEffect(() => {
    let selectedClasses =
      props.sparql
        .match(
          new RegExp(
            '\\?c IN \\(\\s*((?:<?[:#\\.\\/a-zA-Z0-9]+>?,*\\s*)*)\\s*\\)'
          )
        )?.[1]
        .toString()
        .split(',')
        .map((s) => s.trim().replace('<', '').replace('>', '')) || [];
    // There is no ideal solution to for dealing with prefixes here,
    // to keep it simple on this end just replace the 'standard' prefixes
    selectedClasses = selectedClasses.map((c) =>
      c.replace('schema:', 'http://schema.org/')
    );
    setClasses((classes) =>
      classes.map((c) => ({ ...c, selected: selectedClasses.includes(c.uri) }))
    );
  }, [props.sparql]);

  /**
   * Updates the selected value of the given class
   * @param uri URI to identify the class
   * @param checked Checkbox value
   */
  function updateQuery(cs: Option[]): void {
    const selectedClasses = cs.filter((c) => c.selected);
    const classFilter = selectedClasses.map((c) => '<' + c.uri + '>').join(',');
    const classNames = selectedClasses.map((c) => c.label).join(', ');
    props.onChange({ sparql: query(classFilter), title: classNames });
  }

  /**
   * Updates the selected value of the given class
   * @param uri URI to identify the class
   * @param checked Checkbox value
   */
  function toggleClass(uri: string, checked: boolean): void {
    const defIndex = classes.findIndex((c) => c.uri === uri);
    if (classes[defIndex].selected !== checked) {
      const updatedClasses = [...classes];
      updatedClasses[defIndex] = { ...classes[defIndex], selected: checked };
      //setClasses(updatedClasses);
      updateQuery(updatedClasses);
    }
  }

  return (
    <div className="px-4 py-5 space-y-6 sm:p-6">
      <div>
        <h4 className="font-bold mb-2">Only include objects of type:</h4>
        {classes.map((c) => (
          <div key={c.uri} className="flex items-start ml-auto">
            <div className="flex items-center h-5">
              <input
                name="queryHistoryStore"
                checked={c.selected}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                onChange={(event) => toggleClass(c.uri, event.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="queryHistoryStore"
                className="font-medium text-gray-700"
              >
                {c.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleEditor;
