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
        <FullScreenControl />
        <ZoomControl />
      </ControlsContainer>
      <ControlsContainer position="bottom-left">
        <button onClick={props.resetLayout} title="Reset Layout">
          <RefreshIcon className="h-7 w-7 align-middle" />
        </button>
      </ControlsContainer>
    </div>
  );
}

export const MemorizedControls = memo(Controls);

// export interface SearchControlProps {
//   /**
//    * HTML id
//    */
//   id?: string;

//   /**
//    * HTML class
//    */
//   className?: string;

//   /**
//    * HTML CSS style
//    */
//   style?: CSSProperties;
//   handleSelectionChangeFromOthers: (uri: string | null) => void;
// }

/**
 * The `SearchControl` create an input text where user can search a node in the graph by its label.
 * There is an autocomplete based on includes & lower case.
 * When a node is found, the graph will focus on the highlighted node
 *
 * ```jsx
 * <SigmaContainer>
 *   <ControlsContainer>
 *     <SearchControl />
 *   </ControlsContainer>
 * </SigmaContainer>
 * ```
 * See [[SearchControlProps]] for more information.
 *
 * @category Component
 */
