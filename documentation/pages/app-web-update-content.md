# Update App Content

This page gives information about how to update the textual content on the ExecGraph Web App.

The folder `apps\exec-graph-web\src\contents` contains one file per page. These files contain only the text snippets shown on those pages and can simply be modified.
These changes may be made online in the GitHub UI or in a local copy of the repository.

Afterwards the changes may be comitted to the GitHub Repository, the application can be build and described as shown on the installation page.

To check the pages locally a development setup is needed, including:

- Current NodeJS installation with NPM
- Execution of `npm i` in the root folder of the project in your command line interface.

Than run `npx nx serve -o` to start the application. A browser window should open, or copy the url from the command line output to your browser.
