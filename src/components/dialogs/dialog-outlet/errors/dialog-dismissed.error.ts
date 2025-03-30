import { DialogDismissReason } from '../enums';

const HumanReadableDismissReason: Record<DialogDismissReason, string> = {
  [DialogDismissReason.Native]:
    'The dialog has been dismissed, either for clicking outside the dialog, or using the built-in dismiss button',
  [DialogDismissReason.Button]:
    'The dialog has been dismissed because of a custom button closed it',
  [DialogDismissReason.Aborted]:
    'The dialog has been dismissed because a linked AbortSignal has been aborted',
};

export class DialogDismissedError extends Error {
  dissmissReason: DialogDismissReason;

  constructor(reason: DialogDismissReason) {
    super(
      'The dialog has been dismissed and closed. Reason: ' +
        (HumanReadableDismissReason[reason] || 'Unknown'),
    );
    this.dissmissReason = reason;
  }
}
