export enum DialogDismissReason {
  /**
   * The dialog has been dismissed, either by clicking the native "dismiss" button (the X shaped button),
   * or by clicking outside the dialog area
   */
  Native,
  /**
   * The dialog has been dismissed because of a custom button closed it
   */
  Button,
  /**
   * The dialog has been dismissed because a linked {@link AbortSignal abort signal} has been aborted
   */
  Aborted,
}
