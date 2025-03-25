import { createContext } from 'react';

type TabsRestorationMap = Map<string | symbol, string>;

export const WzTabsRestorationContext = createContext<TabsRestorationMap>(
  new Map(),
);
