import {
  ControlsContainer,
  FullScreenControl,
  useSigma,
  ZoomControl,
} from '@react-sigma/core';
import { memo } from 'react';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import LegendPanel from './legendPanel';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { SearchControl } from './search-control';
import { HiOutlineRefresh } from 'react-icons/hi';
import forceAtlas2 from 'graphology-layout-forceatlas2';

/**
 * Type definition of mandatory and optional properties of the {@link Controls} component
 */
export interface ControlsProps {
  /**
   * property to determine whether the graph is with decreased interactivity (e.g. graph on overview page)
   */
  decreasedInteractivity?: boolean;
  /**
   * method to reset the layout
   */
  resetLayout: () => void;
  /**
   * method to trigger when selection in graph was changed
   */
  onSelectionChange?: (node: string | null) => void;
  /**
   * element to render as an control on the graph
   */
  pageSpecificControls?: JSX.Element | null;
}

/**
 * Component to set the controls on the graph.
 *
 * @category React Component
 */
export function Controls(props: ControlsProps) {
  const graph = useSigma().getGraph();
  const settings = forceAtlas2.inferSettings(graph);
  const { start, stop, isRunning } = useWorkerLayoutForceAtlas2({
    settings: settings,
  });

  /**
   * method to call when Reset button is clicked
   */
  function handleResetClick(): void {
    if (isRunning) stop();
    props.resetLayout();
  }

  /**
   * returns the controls on the stage of the graph based on the allowed interactivity
   *
   * @returns controls on the graph stage
   */
  if (props.decreasedInteractivity) {
    // in decreased interactivity mode, only allow zoom controls
    return (
      <div>
        <ControlsContainer position="top-left" className="ml-2 mt-4">
          <ZoomControl />
        </ControlsContainer>
      </div>
    );
  }
  return (
    <>
      <ControlsContainer position="top-right">
        {!props.decreasedInteractivity && (
          <SearchControl onSelectionChange={props.onSelectionChange} />
        )}
      </ControlsContainer>
      <ControlsContainer position="top-left">
        <ZoomControl />
        <FullScreenControl className="border-t border-gray-100/50" />
        <div className="react-sigma-control border-t border-gray-100/50">
          <button
            onClick={() => (!isRunning ? start() : stop())}
            className="h-max w-max"
          >
            {!isRunning ? (
              <BsFillPlayFill
                title="Run ForceAtlas2 Algorithm"
                className="h-7 w-7 align-middle"
              ></BsFillPlayFill>
            ) : (
              <BsFillStopFill
                title="Stop ForceAtlas2 Algorithm"
                className="h-6 w-6 align-middle"
              ></BsFillStopFill>
            )}
          </button>
        </div>
        <div className="react-sigma-control">
          <button onClick={handleResetClick} title="Reset Layout">
            <HiOutlineRefresh className="h-5 w-5 align-middle" />
          </button>
        </div>
      </ControlsContainer>
      <ControlsContainer position="bottom-right">
        <div
          className="panels w-auto overflow-y-auto p-2"
          style={{ maxHeight: '65vh' }}
        >
          <LegendPanel />
        </div>
      </ControlsContainer>
      {props.pageSpecificControls && (
        <ControlsContainer position="bottom-left" className="flex">
          {props.pageSpecificControls}
        </ControlsContainer>
      )}
    </>
  );
}

/**
 * React.memo used so the component does not rerender without its props being changed
 */
export const MemorizedControls = memo(Controls);
