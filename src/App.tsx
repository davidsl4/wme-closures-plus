import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { ClosureEditorPanel } from 'components/portals';
import { WmeSdkProvider } from 'contexts/WmeSdkContext';
import { useEffect, useRef } from 'react';
import { WmeSDK } from 'wme-sdk-typings';

interface AppProps {
  wmeSdk?: WmeSDK;
}
export function App(props: AppProps) {
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
    <WmeSdkProvider wmeSdk={props.wmeSdk}>
      <ClosureEditorPanel />
    </WmeSdkProvider>
  );
}
App.displayName = __SCRIPT_CAMEL_CASE_NAME__;
