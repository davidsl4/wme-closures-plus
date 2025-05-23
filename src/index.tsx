import { createRoot } from 'react-dom/client';
import { getWmeSdk, SDK_INITIALIZED } from './utils/sdk-utils';
import { App } from './App';
import { asScriptTab } from 'utils/as-script-tab';
import { createElement } from 'react';
import PlusBranded from './assets/plus-branded.svg';

import './utils/wme-date-format';

await SDK_INITIALIZED;
const wmeSdk = await initWmeSdkPlus(
  getWmeSdk({
    scriptId: __SCRIPT_ID__,
    scriptName: __SCRIPT_NAME__,
  }),
);

const root = createRoot(document.createDocumentFragment());
const AppWrapper = asScriptTab(
  App,
  <>
    {__SCRIPT_SHORT_NAME__.endsWith('+') ?
      __SCRIPT_SHORT_NAME__.substring(0, __SCRIPT_SHORT_NAME__.length - 1)
    : __SCRIPT_SHORT_NAME__}

    <PlusBranded
      style={{ verticalAlign: 'middle', transform: 'translateY(-10%)' }}
    />
  </>,
);

root.render(
  createElement(AppWrapper, {
    wmeSdk,
  }),
);
