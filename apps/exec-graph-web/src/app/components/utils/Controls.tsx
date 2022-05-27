import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  ZoomControl,
} from '@react-sigma/core';

import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';

function Controls({ layout }: { layout: number }) {
  return (
    <div>
      <ControlsContainer position="bottom-right">
        <FullScreenControl />
        {layout === 2 ? <LayoutForceAtlas2Control /> : ''}
      </ControlsContainer>
      <ControlsContainer position="top-right">
        <SearchControl />
      </ControlsContainer>
      <ControlsContainer position="top-left">
        <ZoomControl />
      </ControlsContainer>
    </div>
  );
}

export default Controls;
