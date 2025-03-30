import { CustomElement } from 'custom-element';
import { ReactNode, Ref, useEffect, useImperativeHandle, useRef } from 'react';

interface WzDialogElementEventMap {
  dialogShown: CustomEvent<void>;
  dialogHidden: CustomEvent<void>;
}
interface WzDialogElement extends CustomElement<WzDialogElementEventMap> {
  showDialog(): Promise<void>;
  hideDialog(): Promise<void>;
}

export interface WzDialog {
  show(): Promise<void>;
  hide(): Promise<void>;
}

export interface WzDialogProps {
  ref?: Ref<WzDialog>;

  size?: 'xxs' | 'xs' | 'sm' | 'lg' | 'xl';
  alignment?: 'default' | 'center';
  dismissible?: boolean;

  title?: ReactNode | string;
  controls?: ReactNode;
  children?: ReactNode;

  openOnMount?: boolean;

  onShown?(event: CustomEvent<void>): void;
  onHidden?(event: CustomEvent<void>): void;
}

export function WzDialog({
  ref,

  title,
  controls,
  children,

  openOnMount = true,

  onShown,
  onHidden,

  ...rest
}: WzDialogProps) {
  const dialogRef = useRef<WzDialogElement>(null);

  useImperativeHandle(ref, () => {
    const assertDialog = () => {
      if (!dialogRef.current) {
        throw new Error('wz-dialog element is not mounted');
      }

      return dialogRef.current;
    };

    return {
      hide: () => assertDialog().hideDialog(),
      show: () => assertDialog().showDialog(),
    };
  }, []);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (onShown) dialogElement?.addEventListener('dialogShown', onShown);

    return () => {
      if (onShown) dialogElement?.removeEventListener('dialogShown', onShown);
    };
  }, [onShown]);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (onHidden) dialogElement?.addEventListener('dialogHidden', onHidden);

    return () => {
      if (onHidden)
        dialogElement?.removeEventListener('dialogHidden', onHidden);
    };
  }, [onHidden]);

  return (
    <wz-dialog
      ref={(dialogElement: WzDialogElement | null) => {
        dialogRef.current = dialogElement;
        if (dialogElement && openOnMount) dialogElement.showDialog();
      }}
      {...rest}
    >
      {title && <wz-dialog-header>{title}</wz-dialog-header>}
      <wz-dialog-content>{children}</wz-dialog-content>
      {controls && <wz-dialog-controls>{controls}</wz-dialog-controls>}
    </wz-dialog>
  );
}
