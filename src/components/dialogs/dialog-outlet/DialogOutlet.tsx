/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentType,
  Ref,
  SyntheticEvent,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { WzDialog, WzDialogProps } from '../../WzDialog';
import { createSafePortal } from 'utils/create-safe-portal';
import { DialogDismissedError } from './errors';
import { DialogDismissReason } from './enums';
import { DialogLayoutProps } from './interfaces';
// import { DialogLayoutRef } from './interfaces/dialog-layout-ref';

type DialogProps = Pick<
  WzDialogProps,
  'size' | 'alignment' | 'dismissible' | 'title'
>;

export interface DialogOutlet {
  showDialog<P extends DialogLayoutProps<any>>(
    layoutComponent: ComponentType<P>,
    layoutProps?: Omit<P, 'stateRef'>,
    options?: {
      signal?: AbortSignal;
      dialogProps?: DialogProps;
      confirmButtonLabel?: string;
      cancelButtonLabel?: string;
    },
  ): Promise<P extends DialogLayoutProps<infer S> ? S : never>;
}

export interface DialogOutletProps {
  ref?: Ref<DialogOutlet>;
}
export function DialogOutlet({ ref }: DialogOutletProps) {
  const [activeDialog, setActiveDialog] = useState<{
    Layout: ComponentType<DialogLayoutProps<any>>;
    layoutProps: any;
    dialogProps: DialogProps;
    buttons: DialogButton[];
    onDismiss: (dialogState: any) => void;
  } | null>(null);
  // const activeLayoutRef = useRef<DialogLayoutRef>(null);
  const activeLayoutStateRef = useRef<any>(null);

  const destructingButton = useCallback(
    (handler: (dialogState: any) => void) => {
      return (dialogState: any) => {
        handler(dialogState);
        setActiveDialog(null);
      };
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      showDialog(layoutComponent, layoutProps = {} as any, options = {}) {
        return new Promise((resolve, reject) => {
          if (options.signal) {
            options.signal.addEventListener('abort', () => {
              reject(new DialogDismissedError(DialogDismissReason.Aborted));
              setActiveDialog(null);
            });
          }

          setActiveDialog({
            Layout: layoutComponent as any,
            layoutProps: layoutProps,
            dialogProps: options.dialogProps ?? {},
            buttons: [
              {
                id: 'applyBtn',
                label: options?.confirmButtonLabel ?? 'Apply',
                action: destructingButton((result) => resolve(result)),
              },
              {
                id: 'cancelBtn',
                label: options?.cancelButtonLabel ?? 'Cancel',
                action: destructingButton(() =>
                  reject(new DialogDismissedError(DialogDismissReason.Button)),
                ),
              },
            ],
            onDismiss: () => {
              reject(new DialogDismissedError(DialogDismissReason.Native));
              setActiveDialog(null);
            },
          });
        });
      },
    }),
    [destructingButton],
  );

  if (!activeDialog) return null;

  const renderButton = (button: DialogButton, buttonIndex: number) => {
    const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
      event.currentTarget.blur();
      button.action(activeLayoutStateRef.current);
    };

    return (
      <wz-button
        key={button.id}
        onClick={handleClick}
        color={buttonIndex === 0 ? 'primary' : 'secondary'}
      >
        {button.label}
      </wz-button>
    );
  };

  return createSafePortal(
    <WzDialog
      {...activeDialog.dialogProps}
      controls={activeDialog.buttons.map(renderButton)}
      onHidden={activeDialog.onDismiss}
    >
      <activeDialog.Layout
        {...activeDialog.layoutProps}
        stateRef={activeLayoutStateRef}
      />
    </WzDialog>,
    document.getElementById('wz-dialog-container'),
  );
}

interface DialogButton {
  id: string;
  label: string;
  action(dialogState: any): void;
}
