# Projet Documentation

The project is configured to create an HTML documentation for the entire monorepo including internal libaries. To do so TypeDoc with various projects is utilised.

## Generating Documentation

The documentation folder contains a custom script which adapts typedoc to generate one documentation for the entire monorepo. Therefore, to generate the documentation you must compile the custom script by running `npm run compile-typedoc` (only if the scripts changed) followed by `npm run generate-docs` to generate the actual html documentation. The output can be found at `./dist/docs`.

## Apps & Libraries

Each app and library is considered a module in the documentation. The configuration is pulled from the NX Project Configuration.
Each app/library should maintain its own Readme.md next to its package.json or project.json, which is automatically pulled into the generated documentation.

## Adding additional pages

Additional pages may be added to the `/documentation` folder, as its the case with the page you are looking at right now.
Once added there, they have to be added to the page tree in `/typedoc.json`.

At this point it is only possible to link either the markdown files (which works on github) or link to the generated html (which works in the documentation). Writing a link rewriter to make this work is still an open task.

## Code Documentation

The code documentation is the central part of the generated documentation and the main workload is done by TypeDoc which extracts type information and JSDoc annotations.

The recommendation is to use JSDoc to:

- Describe each class, attribute/variable, function/method in one sentence
  − Describe input/output parameters and rising errors (if there are any)
  − Add your author information in each module (TODO clarify module = library or file)

### React Components

Since from a Typescript perspective modern React components are purely functions, the @category tag should be used to differentiate them from other functions.

Example:

```
/**
 *
 * @category React Component
 */
export function App() {
  return (
```
