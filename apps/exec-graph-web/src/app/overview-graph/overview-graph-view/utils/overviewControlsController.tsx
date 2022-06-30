import { ControlsContainer, ZoomControl } from '@react-sigma/core';

export interface ControlsProps {
  setLayout: () => void;
}

function Controls(props: ControlsProps) {
  return (
    <div>
      <ControlsContainer position="top-left" className="ml-2 mt-4">
        <ZoomControl />
      </ControlsContainer>
    </div>
  );
}

export default Controls;
