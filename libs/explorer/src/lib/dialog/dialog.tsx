import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

/**
 * Type definition of mandatory and optional properties of the {@link ExploreDialog} component
 */
export interface ExploreDialogProps {
  /**
   * The content of the dialog
   */
  children?: JSX.Element;
  /**
   * If true, the dialog is shown
   */
  show?: boolean;
  /**
   * Function that results in setting the show property to false. Is called when the user clicks a close button, escape or clicks next to the dialog.
   */
  close: () => void;
  /**
   * optional title of the dialog, will be formatted consistenly
   */
  title?: string | JSX.Element;
  /**
   * Tailwind CSS Class to define the (max) width of the dialog
   */
  width?: string;
}

/**
 * Renders a Dialog preconfigured for the Explore page
 *
 * The dialogs content should be passed as child elements,
 * while the rest can be configured through the props.
 *
 * The dialog is schown when passing true to the show prop.
 * It should be able to close itself by calling props.close.
 *
 * The Dialog will be centered, both horizontally and
 * vertically. Its (max) width may be configured through
 * the respective prop.
 *
 * @category React Component
 */
export function ExploreDialog(props: ExploreDialogProps): JSX.Element {
  return (
    <Dialog
      open={props.show || false}
      onClose={props.close}
      className="relative z-[200]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className={`fixed inset-0 flex items-center justify-center p-4`}>
        <Dialog.Panel
          className={`w-full relative rounded bg-white ${props.width}`}
        >
          {props.title && (
            <Dialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
              {props.title}
            </Dialog.Title>
          )}
          <button
            title="Close Dialog"
            onClick={props.close}
            className="absolute top-0 right-0 flex p-2 items-center"
          >
            <XIcon className="w-4 h-4"></XIcon>
            <span className="ml-auto text-sm">Close</span>
          </button>
          {props.children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ExploreDialog;
