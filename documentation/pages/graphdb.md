# GraphDB

A remote SPARQL Endpoint as DataSource can be provided by [GraphDB](https://www.ontotext.com/products/graphdb/).

## Local Development

For local development the GraphDB (Free) Desktop version can be used.

1. Acquire an executable of GraphDB for your OS
2. Install & start it following GraphDBs instructions
3. Create a new local repository
4. Import all \*.ttl files of the ExecGraph project
5. Depending on your setup, you may want to configure `graphdb.workbench.cors.enable true` and `graphdb.workbench.cors.origin *`

## Server

Check the server fullfills the [following requirements (as of GraphDB 9.11)](https://graphdb.ontotext.com/documentation/free/requirements.html):

- Java SE Development Kit 11 to 16
- 2GB Memory
- 2GB Disk Space

1. Follow the instructions on [this page](https://graphdb.ontotext.com/documentation/free/quick-start-guide.html#quick-start-guide-run-gdb-as-standalone-server)
2. Create a new repository
3. Configure user access control to ensure read only access for the public
4. [Load the data](https://graphdb.ontotext.com/documentation/free/quick-start-guide.html#load-your-data)
5. Configure the executable to be restarted automatically, it can be done in server only mode (`-s` flag) without the workbench

## Update data in an existing server

Changes can be added via SPARQL, or in this specific case by purging/removing the repository and creating a new one.
