import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { DialogDismissedError } from 'components/dialogs/dialog-outlet';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchError } from 'utils';
import { createSafePortal } from 'utils/create-safe-portal';
import { css, cx } from '@emotion/css';
import { SelectedRecurringMode } from 'components/dialogs/reccuring-closure-config-dialog/interfaces';

const formGroupClass = css({
  display: 'flex',

  '& > wz-checkbox': {
    flex: 1,
  },
});

export interface RecurringClosureProps {
  closureEditPanel: Element;
}
export function RecurringClosure({ closureEditPanel }: RecurringClosureProps) {
  const dialogOutletRef = useRef<DialogOutlet>(null);
  const recurringClosureFormGroup = useMemo(() => {
    const newFormGroup = document.createElement('div');
    newFormGroup.className = cx('form-group', formGroupClass);
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
  const [config, setConfig] = useState<SelectedRecurringMode | null>(null);

  const showConfigDialog = async () => {
    const [dismissReason, result] = await catchError(
      dialogOutletRef.current.showDialog(
        ReccuringClosureConfigDialog,
        {
          initialMode: config?.id,
          initialFieldValues: config?.fields,
        },
        {
          dialogProps: {
            title: 'Set Closure Repetition',
          },
          disabledButtons: ['APPLY'],
        },
      ),
      [DialogDismissedError],
    );

    if (dismissReason) return;

    setIsEnabled(true);
    setConfig(result.recurringMode);
  };

  const handleCheckboxChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;

    if (checkbox.checked) {
      if (!config) {
        event.preventDefault();
        showConfigDialog();
      }
    }

    if (!event.isDefaultPrevented()) {
      setIsEnabled(checkbox.checked);
    } else {
      checkbox.checked = !checkbox.checked;
    }
  };

  const handleButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    showConfigDialog();
  };

  return createSafePortal(
    <>
      <wz-checkbox
        checked={isEnabled && config}
        onChange={handleCheckboxChanged}
      >
        Reccuring Closure
      </wz-checkbox>

      <wz-button
        color="text"
        size="sm"
        disabled={!isEnabled || !config}
        onClick={handleButtonClick}
      >
        Change
      </wz-button>

      <DialogOutlet ref={dialogOutletRef} />
    </>,
    recurringClosureFormGroup,
  );
}
