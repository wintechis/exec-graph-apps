import { DateTime } from 'luxon';
import { URI_REGEX } from './string.utils';

/**
 * Renders an RDF Uri, either selectable or not
 */
function renderRdfUri(
  uri: string,
  label: string,
  clickable: boolean,
  handleSelectionChange: (object: string) => void = () => null
): JSX.Element {
  uri = uri.replace(/"/g, '');
  return clickable ? (
    <button onClick={() => handleSelectionChange(uri)} className="fau-link">
      {label}
    </button>
  ) : (
    <a
      className="fau-link"
      target="_blank"
      href={uri}
      title={uri}
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

/**
 * Takes the information from a node/object and render a clickable label.
 *
 * Depending on the available information it should be rendered human friendly.
 */
export function renderClickableObjectLabel(
  uri: string,
  attributes: { [key: string]: unknown },
  handleSelectionChange: (object: string) => void
): JSX.Element {
  return (
    <button
      title={uri}
      onClick={() => handleSelectionChange(uri)}
      className="fau-link"
    >
      {getObjectLabel(uri, attributes) || uri}
    </button>
  );
}

/**
 * Regular Expression to recognise TypedLiterals and extract value and type.
 */
const TYPED_LITERAL_REGEX =
  /^"(.*)"\^\^http:\/\/www\.w3\.org\/2001\/XMLSchema#(.*)$/;

/**
 * Renders an RDF Term which can be an RDF URI Reference, RDF Literal or Blank Node
 *
 * @todo Display external non RDF Urls (e.g. LinkedIn)
 * @param term
 */
export function renderRdfTerm(
  term: unknown,
  selectable = true,
  getLabel?: (uri: string) => string
): JSX.Element {
  const termStr = String(term);
  const typedLiteralElements = TYPED_LITERAL_REGEX.exec(termStr);
  if (null !== typedLiteralElements) {
    if (typedLiteralElements[2] === 'boolean') {
      return <span>{typedLiteralElements[1] === '1' ? 'Yes' : 'No'}</span>;
    }
    if (typedLiteralElements[2] === 'dateTime') {
      return (
        <span>
          {DateTime.fromISO(typedLiteralElements[1])
            .setLocale('en-GB')
            .toLocaleString()}
        </span>
      );
    }
    console.log(termStr);
    if (
      typedLiteralElements[2] === 'integer' ||
      typedLiteralElements[2] === 'decimal'
    ) {
      return (
        <span>
          {new Intl.NumberFormat('en').format(+typedLiteralElements[1])}
        </span>
      );
    }
    return <span>{typedLiteralElements[1]}</span>;
  }
  if (URI_REGEX.test(termStr)) {
    // -- is a RDF Uri (or any other URL)
    return renderRdfUri(
      termStr,
      getLabel ? getLabel(termStr) : termStr,
      selectable
    );
  }
  return <span>{termStr.replace(/^"?(.*?)"?(?:@en)?$/g, '$1')}</span>; // fallback, removes " and en language codes
}

/**
 * Tries to extract a human friendly name for an object uri out of the given attributes
 */
export function getObjectLabel(
  name: string,
  attributes: { [key: string]: unknown }
): string {
  return String(
    attributes['http://www.w3.org/2000/01/rdf-schema#label'] || name
  ).replace(/^"?(.*?)"?(?:@en)?$/g, '$1');
}
