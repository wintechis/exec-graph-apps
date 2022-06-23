import { Dialog } from '@headlessui/react';

export interface ExploreDialogProps {
  children?: JSX.Element;
  show?: boolean;
  close?: () => void;
  title?: string | JSX.Element;
  width?: string;
}

export function ExploreDialog(props: ExploreDialogProps) {
  return (
    <Dialog
      open={props.show || false}
      onClose={() => (props.close ? props.close() : null)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 ${props.width}`}
      >
        <Dialog.Panel className="w-full max-w-md rounded bg-white">
          {props.title && (
            <Dialog.Title className="p-4 pb-0 text-xl font-bold leading-6 mb-4">
              {props.title}
            </Dialog.Title>
          )}
          {props.children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ExploreDialog;
