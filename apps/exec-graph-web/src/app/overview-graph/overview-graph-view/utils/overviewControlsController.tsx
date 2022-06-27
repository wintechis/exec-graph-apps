import { ControlsContainer, ZoomControl } from '@react-sigma/core';

export interface ControlsProps {
  setLayout: () => void;
}

function Controls(props: ControlsProps) {
  return (
    <div>
      <ControlsContainer position="top-left">
        <ZoomControl />
      </ControlsContainer>
    </div>
  );
}

export default Controls;
