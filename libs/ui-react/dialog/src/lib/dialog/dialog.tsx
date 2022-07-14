import { Dialog as HeadlessDialog } from '@headlessui/react';
import { HiOutlineX } from 'react-icons/hi';

/**
 * Type definition of mandatory and optional properties of the {@link Dialog} component
 */
export interface DialogProps {
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
function Dialog(props: DialogProps): JSX.Element {
  return (
    <HeadlessDialog
      open={props.show || false}
      onClose={props.close}
      className="relative z-[200]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className={`fixed inset-0 flex items-center justify-center p-4`}>
        <HeadlessDialog.Panel
          className={`w-full relative rounded bg-white ${props.width}`}
        >
          {props.title && (
            <HeadlessDialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
              {props.title}
            </HeadlessDialog.Title>
          )}
          <button
            title="Close Dialog"
            onClick={props.close}
            className="absolute top-0 right-0 flex p-2 items-center"
          >
            <HiOutlineX className="w-4 h-4" />
            <span className="ml-auto text-sm">Close</span>
          </button>
          {props.children}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
}

export default Dialog;
