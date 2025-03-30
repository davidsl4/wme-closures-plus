import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
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
      Hello World!
      <DialogOutlet ref={dialogOutletRef} />
    </>
  );
}
App.displayName = __SCRIPT_CAMEL_CASE_NAME__;
