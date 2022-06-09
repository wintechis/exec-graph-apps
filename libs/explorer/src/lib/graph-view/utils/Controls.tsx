import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  ZoomControl,
} from '@react-sigma/core';


function Controls() {
  return (
    <div>
      <ControlsContainer position="bottom-right">
        <FullScreenControl />
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
