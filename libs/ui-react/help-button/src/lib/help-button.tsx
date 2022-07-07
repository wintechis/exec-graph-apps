import { Popover, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { memo, useState } from 'react';
import { usePopper } from 'react-popper';

/**
 * Type definition of mandatory and optional properties of the {@link HelpButton} component
 */
export interface HelpButtonProps {
  /**
   * The content of the popover
   */
  advise: JSX.Element | string;
}

/**
 * Creates a help-icon which displays a help text on hover as popover
 * @category React Component
 */
export const HelpButton = memo(function HelpButton(
  props: HelpButtonProps
): JSX.Element {
  const [isShowing, setIsShowing] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          allowedAutoPlacements: ['bottom', 'bottom-start', 'bottom-end'],
          fallbackPlacements: ['top', 'bottom-end', 'top-start'],
          altBoundary: true,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
  });

  return (
    <Popover className="inline relative z-1">
      <Popover.Button
        ref={setReferenceElement}
        className="mx-2 align-middle relative"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        <QuestionMarkCircleIcon
          className="text-fau-blue h-4 w-4"
          aria-label="Help"
        ></QuestionMarkCircleIcon>
      </Popover.Button>

      <Transition
        show={isShowing}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          ref={setPopperElement}
          style={styles['popper']}
          {...attributes['popper']}
          className="z-40 p-4 bg-white shadow-lg border border-gray-300 rounded-md w-96 text-base font-normal not-italic"
        >
          {props.advise}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});

export default HelpButton;
