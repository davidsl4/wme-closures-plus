import { ComponentProps, useEffect, useMemo } from 'react';
import { createSafePortal } from 'utils/create-safe-portal';

export interface RecurringClosureCheckboxProps extends ComponentProps<'input'> {
  closureEditPanel: Element;
}
export function RecurringClosureCheckbox({
  key,
  closureEditPanel,
  ...checkboxProps
}: RecurringClosureCheckboxProps) {
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

  const checkbox = (
    <wz-checkbox {...checkboxProps}>
      {checkboxProps.children ?? 'Reccuring Closure'}
    </wz-checkbox>
  );
  return createSafePortal(checkbox, recurringClosureFormGroup, key);
}
