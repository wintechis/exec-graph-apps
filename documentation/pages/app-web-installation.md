# Installation Guide

To use the app it has to be made available through a webserver. This encompasses two steps, build and deployment. If you have obtained a pre-build version you may skip the first step.

### Build Instructions

1. Clone the project to your working directory, all following commands expect to be executed in the root directoy of the project files.
2. Make sure all dependencies are installed by executing `npm install`
3. Build the Web App by executing `npm run build`
4. The relevant application files can be found in `<project_root>/dist/apps/exec-graph-web`

#### Build to deploy in a subfolder
If the app is deployed to a subfolder the basepath in the `environment.prod.ts` of the application has to be set and the `--deployUrl` parameter has to be passed at step 3.
Example: `nx build --deployUrl '/<path-to-exec-graph-web>/'` (same path must be configured in the `environment.prod.ts`)

### Deployment Instructions

1. Copy the application files from the build to your webservers public directory.
2. If needed, configure the choosen webserver to serve the files correctly. This may include setting rewrite rules. Please review the documentation of your webserver for further instructions. Usually all requests to non-existent files should be redirected to the `index.html`.
3. Access the folder with the index.html file through your webbrowser using the domain of your webserver.
