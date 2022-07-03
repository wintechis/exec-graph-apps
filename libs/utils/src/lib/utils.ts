/**
 * RegEx to test a URI
 *
 * As defined in https://www.rfc-editor.org/rfc/rfc3986#page-50
 * Slightly modified to expect a protocoll
 */
export const URI_REGEX =
  /^(([^:/?#]+):)+(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

/**
 * Capitalizes the first letter of each word, similar to title caseing.
 *
 * @param str the string to convert
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
