import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDeployed)
      setTimeout(() => {
        if (dom.current)
          dom.current.parentElement?.scrollTo({
            top: dom.current.offsetTop - 5,
            behavior: 'smooth',
          });
      }, DURATION);
  }, [isDeployed]);

  return (
    <div className={isDeployed ? 'panel opened' : 'panel closed'} ref={dom}>
      <button type="button" onClick={() => setIsDeployed((v) => !v)}>
        {props.title}
        {isDeployed ? <MdExpandLess /> : <MdExpandMore />}
      </button>
      <AnimateHeight duration={DURATION} height={isDeployed ? 'auto' : 0}>
        {props.children}
      </AnimateHeight>
    </div>
  );
}

export default Panel;
