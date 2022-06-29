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
  resetLayout: () => void;
  handleSelectionChangeFromOthers: (uri: string | null) => void;
}

function Controls(props: ControlsProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  function handleSearchChange(this: HTMLInputElement, ev: Event): unknown {
    if (!this) return;

    if (this.value !== '') {
      graph.forEachNode((key: string, attributes: Attributes): void => {
        if (
          attributes['label'] &&
          attributes['label'].toLowerCase() === this.value.toLowerCase()
        )
          props.handleSelectionChangeFromOthers(key);
      });
    } else props.handleSelectionChangeFromOthers(null);

    return;
  }

  useEffect(() => {
    sigma.addListener('afterRender', () => {
      const input = document.querySelector(
        'input[id^=search-]'
      ) as HTMLInputElement;

      input?.addEventListener('change', handleSearchChange);
    });
  });

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
}

export const MemorizedControls = memo(Controls);
