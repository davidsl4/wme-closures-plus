import { ClosureEditorPanel } from 'components/portals';
import { WmeSdkProvider } from 'contexts/WmeSdkContext';
import { WmeSDK } from 'wme-sdk-typings';

interface AppProps {
  wmeSdk?: WmeSDK;
}
export function App(props: AppProps) {
  return (
    <WmeSdkProvider wmeSdk={props.wmeSdk}>
      <ClosureEditorPanel />
    </WmeSdkProvider>
  );
}
App.displayName = __SCRIPT_CAMEL_CASE_NAME__;
