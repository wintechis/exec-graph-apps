import React, { ReactNode, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

const DURATION = 300;

export interface PanelProps {
  title: JSX.Element | string;
  initiallyDeployed?: boolean;
  children?: ReactNode;
}

function Panel(props: PanelProps) {
  const [isDeployed, setIsDeployed] = useState(false);

  return (
    <div
      className={isDeployed ? 'panel opened p-2 mb-2' : 'panel closed'}
      style={isDeployed ? { width: '15vw' } : {}}
    >
      <button
        className="hover:opacity-70 text-left w-full"
        type="button"
        onClick={() => setIsDeployed((v) => !v)}
      >
        {props.title}
        {isDeployed ? (
          <MdExpandLess
            className="align-middle inline-block text-2xl"
            style={
              isDeployed
                ? { position: 'absolute', right: '0px', marginRight: '0.5rem' }
                : {}
            }
          />
        ) : (
          <MdExpandMore className="align-middle inline-block text-2xl" />
        )}
      </button>
      <AnimateHeight
        className={isDeployed ? 'text-sm w-max' : 'hidden'}
        duration={DURATION}
        height={isDeployed ? 'auto' : 0}
      >
        {props.children}
      </AnimateHeight>
    </div>
  );
}

export default Panel;
