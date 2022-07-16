import { BsMouse } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

/**
 * Contains the end user help text for the explorer page in the exec-graph-web app
 *
 * @category React Component
 * @author Albin Lokaj
 */
export function ExplorerHelpText(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <p className="pl-4 pr-4">
        The explorer enables the opportunity to explore the data and interact
        with the knowledge graph.
      </p>
      <div className="p-4">
        <p className="pb-1 font-bold text-lg">Mouse Interaction:</p>
        <div className="w-full inline-flex">
          <div className="w-1/12">
            <BsMouse className="w-full h-full"></BsMouse>
          </div>
          <div className="pl-6 w-11/12">
            <ol className="list-disc">
              <li>
                Hover over/click on nodes to reduce graph to subgraph with that
                node
              </li>
              <li>Zoom in and out using mouse wheel</li>
              <li>Drag the graph background to move the graph</li>
              <li>Drag node to move node</li>
              <li>
                Click on a node to display details section below the graph
              </li>
            </ol>
          </div>
        </div>
        <p className="pt-1">
          The details section displays information about the clicked node and
          its relations to others.
        </p>
      </div>
      <div className="p-4">
        <p className="pb-1 font-bold text-lg">Controls:</p>
        <div className="w-full inline-flex">
          <div className="w-1/12">
            <FiSettings className="w-full h-full"></FiSettings>
          </div>
          <div className="pl-6 w-11/12">
            <ol className="list-disc">
              <li>
                On the upper left, you can zoom, center the camera, enter full
                screen mode and run/stop the Layout Algorithm (ForceAtlas2)
              </li>
              <li>On the upper right, you can search for nodes in the graph</li>
              <li>
                On the lower left, you can press the button to scroll to the
                details
              </li>
              <li>On the lower right, you can access the legend</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="pb-1 font-bold text-lg">Search:</p>
        <div className="w-full inline-flex">
          <div className="w-1/12">
            <HiOutlineSearch className="w-full h-full"></HiOutlineSearch>
          </div>
          <div className="pl-6 w-11/12">
            Above the graph is a button to open the search dialog. <br />
            You can enter a keyword and may get two kinds of results:
            <ol className="pl-8 pt-1 pb-1 list-decimal">
              <li>Matches in the current graph</li>
              <li>Matches in the entire graph</li>
            </ol>
            Selecting from the first list will select a node in the current
            graph (like the other search field)
            <br />
            Selecting from the second will issue a query to load only
            information related to the object.
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="pb-1 font-bold text-lg">Query Editor:</p>
        <div className="w-full inline-flex">
          <div className="w-1/12">
            <HiOutlineFilter className="w-full h-full"></HiOutlineFilter>
          </div>
          <div className="pl-6 w-11/12">
            Above the graph is a button to open the filter dialog.
            <br />
            The dialog consists of four tabs:
            <ol className="pl-8 pt-1 pb-1 list-decimal">
              <li className="font-bold">
                Library
                <span className="font-normal block mb-1">
                  It contains pre-defined queries to quickly find data relating
                  to a specific topic or of a specific kind.
                </span>
              </li>
              <li className="font-bold">
                Filter
                <span className="font-normal block mb-1">
                  The simple filter allows to easily filter objects according to
                  their type.
                </span>
              </li>
              <li className="font-bold">
                Advanced
                <span className="font-normal block mb-1">
                  The advanced editor provides a form with autocompletion lists
                  to create a custom SPARQL query. <br />
                  Please note, that basic SPARQL knowledge is required to
                  efficiently use the advanced editor.
                </span>
              </li>
              <li className="font-bold">
                SPARQL
                <span className="font-normal block mb-1">
                  For full flexibility you may use the free-text SPARQL editor
                  to create a custom query.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorerHelpText;
