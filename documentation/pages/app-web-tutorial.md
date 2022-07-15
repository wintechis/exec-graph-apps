# Tutorial

This is the WIP end-user documentation for the exec-graph-web app. The tutorial focuses on explaining the interaction with the graphs and the Explore page.

## Interacting with the graph

### View Details
Click to select a node in the graph. This will enable you to hide all but the direct neighbors and view attributes and connections in the detail view below the graph. 

## Searching for a person, entity or location

Through the search icon at the top right you may open a search dialog. Enter your keyword into the search field. You may get two kinds of result.

1. Matches in the current graph
2. Matches in the entire graph

Selecting one from the first list will select it in the current graph, while choosing one from the second will issue a query to load all information related to the object.

Note: The blue search on the graph view behaves equal to the current Graph matches in the search dialog.

## Customize the displayed data (Filter)

The application opens the opportunity to create a query to customize the displayed data. To open the Query Editor click the respective icon in the top bar on the explorer page. The query editor provides different options to change the query, however, in the background they all utilise SPARQL the query language.

### 1. Library
Select a predefined query to quickly find data relating to a specific topic or if a specific kind.

### 2. Filter
This tab allows you to only include specific types (classes) of nodes in the graph. It will include all edges between them.

### 3. Advanced
The advanced editor provides a form with autocompletion lists to create a custom SPARQL query. Please note, that basic SPARQL knowledge is required to efficently use the advanced editor-

### 4. SPARQL
For full flexibility you may use the free-text SPARQL editor to create a custom query.

