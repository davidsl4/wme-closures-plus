import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { DialogDismissedError } from 'components/dialogs/dialog-outlet';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchError } from 'utils';
import { createSafePortal } from 'utils/create-safe-portal';

export interface RecurringClosureProps {
  closureEditPanel: Element;
}
export function RecurringClosure({ closureEditPanel }: RecurringClosureProps) {
  const dialogOutletRef = useRef<DialogOutlet>(null);
  const recurringClosureFormGroup = useMemo(() => {
    const newFormGroup = document.createElement('div');
    newFormGroup.className = 'form-group';
    return newFormGroup;
  }, []);
  useEffect(() => {
    const endDateElement = closureEditPanel.querySelector(
      '.form-group.end-date-form-group',
    );
    endDateElement.after(recurringClosureFormGroup);

    return () => {
      recurringClosureFormGroup.remove();
    };
  }, [closureEditPanel, recurringClosureFormGroup]);

  const [isEnabled, setIsEnabled] = useState(false);

  const handleCheckboxChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;

    if (checkbox.checked) {
      event.preventDefault();
      (async () => {
        const [dismissReason, result] = await catchError(
          dialogOutletRef.current.showDialog(
            ReccuringClosureConfigDialog,
            {},
            {
              dialogProps: {
                title: 'Set Closure Repetition',
              },
              disabledButtons: ['APPLY'],
            },
          ),
          [DialogDismissedError],
        );
        console.log(dismissReason, result);
      })();
    }

    if (!event.isDefaultPrevented()) {
      setIsEnabled(checkbox.checked);
    } else {
      checkbox.checked = !checkbox.checked;
    }
  };

  return createSafePortal(
    <>
      <wz-checkbox checked={isEnabled} onChange={handleCheckboxChanged}>
        Reccuring Closure
      </wz-checkbox>

      <DialogOutlet ref={dialogOutletRef} />
    </>,
    recurringClosureFormGroup,
  );
}
