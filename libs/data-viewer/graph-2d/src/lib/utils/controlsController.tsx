import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  ZoomControl,
} from '@react-sigma/core';
import { RefreshIcon } from '@heroicons/react/outline';
import { memo } from 'react';
import React, { useEffect } from 'react';
import { Attributes } from 'graphology-types';
import { useSigma } from '@react-sigma/core';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';

export interface ControlsProps {
  explorer: boolean;
  resetLayout: () => void;
  handleSelectionChangeFromOthers?: (node: string | null) => void;
}

function Controls(props: ControlsProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();

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

  if (props.explorer) {
    return (
      <div>
        <ControlsContainer position="top-right">
          <SearchControl />
        </ControlsContainer>
        <ControlsContainer position="top-left">
          <ZoomControl />
          <FullScreenControl className="border-t border-gray-100/50" />
          <LayoutForceAtlas2Control className="border-t border-gray-100/50"></LayoutForceAtlas2Control>
          <div className="react-sigma-control">
            <button onClick={props.resetLayout} title="Reset Layout">
              <RefreshIcon className="h-5 w-5 align-middle" />
            </button>
          </div>
        </ControlsContainer>
      </div>
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
