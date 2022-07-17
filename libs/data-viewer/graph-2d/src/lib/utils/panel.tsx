import React, { ReactNode, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

// duration forthe panel animation opening 
const DURATION = 600;

/**
 * Type definition of optional properties of the {@link SearchControl} component
 */
export interface PanelProps {
  // title for the panel, always displayed
  title: JSX.Element | string;
  // whether the panel should be deployed initially
  initiallyDeployed?: boolean;
  // children nodes to render 
  children?: ReactNode;
}

function Panel(props: PanelProps) {
  const [isDeployed, setIsDeployed] = useState(false);

  return (
    <div
      className={isDeployed ? 'p-2 mb-2' : ''}
      style={isDeployed ? { minWidth: 'fit-content', width: '15vw' } : {}}
    >
      <button
        className={
          'hover:opacity-70 text-left w-full ' + (isDeployed ? 'mb-2' : '')
        }
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
