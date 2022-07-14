import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  ZoomControl,
} from '@react-sigma/core';
import { memo } from 'react';
import React, { useEffect } from 'react';
import { Attributes } from 'graphology-types';
import { useSigma } from '@react-sigma/core';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import LegendPanel from './legendPanel';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { HiOutlineArrowDown, HiOutlineRefresh } from 'react-icons/hi';

export interface ControlsProps {
  explorer: boolean;
  resetLayout: () => void;
  handleSelectionChangeFromOthers?: (node: string | null) => void;
  handleScrollButtonClick?: () => void;
}

function Controls(props: ControlsProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const { start, stop, isRunning } = useWorkerLayoutForceAtlas2({});

  function handleSearchChange(this: HTMLInputElement, ev: Event): unknown {
    if (!this) return;
    if (!props.handleSelectionChangeFromOthers) return;

    if (this.value !== '') {
      graph.forEachNode((key: string, attributes: Attributes): void => {
        if (
          props.handleSelectionChangeFromOthers &&
          attributes['label'] &&
          attributes['label'].toLowerCase() === this.value.toLowerCase()
        )
          props.handleSelectionChangeFromOthers(key);
      });
    } else props.handleSelectionChangeFromOthers(null);

    return;
  }

  useEffect(() => {
    if (!props.explorer) return;

    sigma.addListener('afterRender', () => {
      const input = document.querySelector(
        'input[id^=search-]'
      ) as HTMLInputElement;

      input?.addEventListener('change', handleSearchChange);
    });
  });

  function handleResetClick() {
    if (isRunning) stop();
    props.resetLayout();
  }

  if (props.explorer) {
    return (
      <>
        <ControlsContainer position="top-right">
          <SearchControl />
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
        <ControlsContainer position="bottom-left">
          <button
            onClick={props.handleScrollButtonClick}
            className="flex p-2 items-center"
          >
            <HiOutlineArrowDown className="w-5 h-5 mr-2" /> Show Details
          </button>
        </ControlsContainer>
      </>
    );
  } else {
    return (
      <div>
        <ControlsContainer position="top-left" className="ml-2 mt-4">
          <ZoomControl />
        </ControlsContainer>
      </div>
    );
  }
}

export const MemorizedControls = memo(Controls);
