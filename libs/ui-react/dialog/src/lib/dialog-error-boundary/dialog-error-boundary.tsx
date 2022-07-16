import { Component, ErrorInfo } from 'react';
import Dialog from '../dialog/dialog';

/**
 * Type definition of mandatory and optional properties of the {@link DialogErrorBoundary} component
 */
export interface DialogErrorBoundaryProps {
  /**
   * The original dialog
   */
  children: JSX.Element;
  /**
   * If true, the dialog is shown
   */
  show?: boolean;
  /**
   * Function that results in setting the show property to false. Is called when the user clicks a close button, escape or clicks next to the dialog.
   */
  close: () => void;
}

/**
 * Wraps a Dialog to show an error message if an error occured within the child.
 *
 * @category React Component
 */
export class DialogErrorBoundary extends Component<
  DialogErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: DialogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  public override componentDidUpdate(
    prevProps: Readonly<DialogErrorBoundaryProps>
  ): void {
    if (
      prevProps.children !== this.props.children ||
      prevProps.show !== this.props.show
    ) {
      this.setState({ hasError: false });
    }
  }

  /**
   * Renders either the original dialog or a error dialog
   * @returns dialog component
   */
  public override render(): JSX.Element {
    if (this.state.hasError && this.props.show) {
      const close = () => {
        this.setState({ hasError: false }, () => this.props.close());
      };
      return (
        <Dialog
          width="max-w-md"
          title="An error occured"
          show={true}
          close={close}
        >
          <div className="p-4">
            <div>
              An error occured in the last dialog. Please try to reopen it. If
              the issue persists, please contact the project team.
            </div>
            <button
              onClick={close}
              className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-fau-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </Dialog>
      );
    }
    return this.props.children;
  }
}

export default DialogErrorBoundary;
