import { ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useWmeSdk } from '../contexts/WmeSdkContext';

interface ScriptTabProps {
  tabId?: string;
  tabLabel: ReactNode;
  children: ReactNode;
}
export function ScriptTab({ tabId, tabLabel, children }: ScriptTabProps) {
  const tabElements = useScriptTabElements(tabId);

  if (!tabElements) return null;

  return (
    <>
      {createPortal(tabLabel, tabElements.tabLabel)}
      {createPortal(children, tabElements.tabPane)}
    </>
  );
}

function useSdkSidebarModule(tabId?: string) {
  const wmeSdk = useWmeSdk();
  return useMemo(() => {
    if (!tabId) return wmeSdk.Sidebar;
    // if we have a tabId, then we need to create a new instance of the Sidebar
    // but with the id of scriptId.tabId
    // to create a new instance of the Sidebar, we need to call the constructor of the Sidebar type (Sidebar is already an instance)
    // and pass the id as the first argument
    const scriptId = (wmeSdk.Sidebar as unknown as { scriptId: string })
      .scriptId;

    const namespacedTabId = `${scriptId}.${tabId}`;
    const SidebarModule = wmeSdk.Sidebar.constructor as {
      new (scriptId: string, scriptName?: string): typeof wmeSdk.Sidebar;
    };
    return new SidebarModule(namespacedTabId);
  }, [tabId, wmeSdk]);
}

function useScriptTabElements(tabId?: string) {
  const sidebarModule = useSdkSidebarModule(tabId);
  const [tabResult, setTabResult] = useState<Awaited<
    ReturnType<typeof sidebarModule.registerScriptTab>
  > | null>(null);

  useEffect(() => {
    sidebarModule.registerScriptTab().then(setTabResult);

    return () => {
      sidebarModule.removeScriptTab();
      setTabResult(null);
    };
  }, [sidebarModule]);

  return tabResult ?
      {
        tabLabel: tabResult.tabLabel,
        tabPane: tabResult.tabPane,
      }
    : null;
}
