import { createRoot } from 'react-dom/client';
import { getWmeSdk, SDK_INITIALIZED } from './utils/sdk-utils';
import { App } from './App';
import { asScriptTab } from 'utils/as-script-tab';
import { createElement } from 'react';

await SDK_INITIALIZED;
const wmeSdk = await initWmeSdkPlus(
  getWmeSdk({
    scriptId: __SCRIPT_ID__,
    scriptName: __SCRIPT_NAME__,
  }),
);

const root = createRoot(document.createDocumentFragment());
const AppWrapper = asScriptTab(App, __SCRIPT_SHORT_NAME__);

root.render(
  createElement(AppWrapper, {
    wmeSdk,
  }),
);
