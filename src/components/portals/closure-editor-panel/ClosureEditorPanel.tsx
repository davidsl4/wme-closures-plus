import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { SyntheticEvent, useRef } from 'react';
import { asUInjectorComponent } from 'utils/as-uinjector-component';
import { RecurringClosureCheckbox } from './RecurringClosureCheckbox';

interface ClosureEditorPanelProps {
  target: Element;
}
function ClosureEditorPanel(props: ClosureEditorPanelProps) {
  const dialogOutletRef = useRef<DialogOutlet>(null);

  const handleRecurringCheckboxChange = (
    event: SyntheticEvent<HTMLInputElement>,
  ) => {
    if (event.currentTarget.checked) {
      event.preventDefault();
      (async () => {
        try {
          await dialogOutletRef.current.showDialog(
            ReccuringClosureConfigDialog,
            {},
            {
              dialogProps: {
                title: 'Set Closure Repetition',
              },
            },
          );
        } catch {
          (event.target as HTMLInputElement).checked = false;
        }
      })();
    }
  };

  return (
    <>
      <RecurringClosureCheckbox
        closureEditPanel={props.target}
        onChange={handleRecurringCheckboxChange}
      />
      <DialogOutlet ref={dialogOutletRef} />
    </>
  );
}

const UInjectorComponent = asUInjectorComponent(ClosureEditorPanel, {
  targetSelector: '.edit-closure',
  wrapInContainer: false,
});
export { UInjectorComponent as ClosureEditorPanel };
