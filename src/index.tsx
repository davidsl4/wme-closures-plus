import { createRoot } from 'react-dom/client';
import { SDK_INITIALIZED } from './utils/sdk-utils';
import { App } from './App';
import { asScriptTab } from 'utils/as-script-tab';
import { createElement } from 'react';

await SDK_INITIALIZED;

const root = createRoot(document.createDocumentFragment());
root.render(createElement(asScriptTab(App, __SCRIPT_SHORT_NAME__)));
