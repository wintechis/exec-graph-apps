# Tutorial

This is the WIP end-user documentation for the exec-graph-web app. The tutorial focuses on explaining the interaction with the graph and the Explore page.

## Interacting with the graph

### Mouse Interaction

The interaction with the graph is designed to be done only with a mouse. You have several interaction options:

- Hover over/click on nodes to reduce the graph to a subgraph with that node
- Zoom in and out using mouse wheel
- Drag the graph background to move the graph
- Drag a node to move it
- Click on a node to display the details section below the graph which displays information about the clicked node and its relations to others

## Using the controls of the graph

There are four groups of controls:

- On the upper left, you can zoom, center the camera, enter full screen mode and run/stop the Layout Algorithm (ForceAtlas2)
- On the upper right, you can search for nodes in the graph
- On the lower left, you can press the button to scroll to the details and clear a selection you have made before
- On the lower right, you can access the legend

## Search

Through the search icon at the top right above the graph you may open a search dialog. Enter your keyword into the search field and you may get two kinds of result:

1. Matches in the current graph
2. Matches in the entire graph

Selecting one from the first list will select it in the current graph, while choosing one from the second will issue a query to load all information related to the object.

Note: The blue search on the graph view behaves equal to the current Graph matches in the search dialog.

## Customize the displayed data (Filter)

The application opens the opportunity to create a query to customize the displayed data. To open the Query Editor click the respective icon in the top bar on the explorer page. The query editor provides different options to change the query, however, in the background they all utilise SPARQL the query language.

### 1. Library

Select a predefined query to quickly find data relating to a specific topic or of a specific kind.

### 2. Filter

This tab allows you to only include specific types (classes) of nodes in the graph. It will include all edges between them.

### 3. Advanced

The advanced editor provides a form with autocompletion lists to create a custom SPARQL query. Please note, that basic SPARQL knowledge is required to efficiently use the advanced editor.

### 4. SPARQL

For full flexibility you may use the free-text SPARQL editor to create a custom query.

## Exploring the details

When you have clicked on a node, its details will open under the graph and all information from the ExecGraph project and selected information of the Link to WIKIDATA will be displayed.
The connections in shown in the details section are configurable and interactive. You may click on objects of connections and the details section will present all information about the clicked object. Also the graph is then updated, so that the clicked object is selected in the graph.
