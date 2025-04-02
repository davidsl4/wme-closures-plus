import { Ref } from 'react';
import { ModalDialogButtons } from '../types';

export interface DialogLayoutButtonProps<B extends string> {
  enableButton(buttonId: B): void;
  disableButton(buttonId: B): void;
  setButtonState(buttonId: B, state: boolean): void;
  getButtonState(buttonId: B): boolean;
}
export interface DialogLayoutProps<S, B extends string = string>
  extends DialogLayoutButtonProps<B> {
  stateRef: Ref<S>;
}

export type ModalDialogLayoutProps<S> = DialogLayoutProps<
  S,
  ModalDialogButtons
>;
