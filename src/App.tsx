import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { ClosureEditorPanel } from 'components/portals';
import { useEffect, useRef } from 'react';

export function App() {
  const dialogOutletRef = useRef<DialogOutlet>(null);

  useEffect(() => {
    dialogOutletRef.current
      ?.showDialog(
        ReccuringClosureConfigDialog,
        {},
        {
          dialogProps: {
            title: 'Set Closure Repetition',
          },
        },
      )
      .then((value) => console.log('Dialog Closed', value))
      .catch((error) => console.log('Dialog Cancelled', error));
  }, []);

  return (
    <>
      <ClosureEditorPanel />
    </>
  );
}
App.displayName = __SCRIPT_CAMEL_CASE_NAME__;
