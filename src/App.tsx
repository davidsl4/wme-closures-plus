import { ClosurePresetsManager } from 'components/closure-presets';
import { ClosureEditorPanel } from 'components/portals';
import { ClosurePresetsListProvider } from 'contexts';
import { WmeSdkProvider } from 'contexts/WmeSdkContext';
import { WmeSDK } from 'wme-sdk-typings';

interface AppProps {
  wmeSdk?: WmeSDK;
}
export function App(props: AppProps) {
  return (
    <WmeSdkProvider wmeSdk={props.wmeSdk}>
      <ClosurePresetsListProvider>
        <ClosureEditorPanel />

        <ClosurePresetsManager />
      </ClosurePresetsListProvider>
    </WmeSdkProvider>
  );
}
App.displayName = __SCRIPT_CAMEL_CASE_NAME__;
