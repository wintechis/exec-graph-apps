# ExecGraph

This project was created as part of a student seminar connected to the Chair of Accounting and Auditing and the Chair of Technical Information Systems of the Friedrich-Alexander-Universität Erlangen-Nürnberg.

Its goal is the visualisation of research data on executive managers in German businesses and their personal networks.

## Installing / Using the application

To use the app it has to be made available through a webserver. THis encompasses two steps, build and deployment. If oyu have obtained a pre-build version you may skip the first step.

### Build Instructions

1. Clone the project to your working directory, all following commands expect to be executed in the root directoy of the project files.
2. Make sure all dependencies are installed by executing `npm install`
3. Build the Web App by executing `npm run build`
4. The relevant application files can be found in `<project_root>/dist/apps/exec-graph-web`

### Deployment Instructions

1. Copy the application files from the build to your webservers public directory.
2. If needed, configure the choosen webserver to serve the files correctly. This may include setting rewrite rules.
3. Access the folder with the index.html file through your webserver

## Development

The project uses Nx.dev to manage the workspace, the core application is build using React, Sigma.js and Tailwind CSS.
All standard nx commands may be used for development.

### NX Commands

#### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

#### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@exec-graph/mylib`.

#### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

#### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

#### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

#### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

#### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

#### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
