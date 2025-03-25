import { CustomElement } from 'custom-element';
import {
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { WzTab, WzTabProps } from './WzTab';
import { WzTabsRestorationContext } from 'contexts/WzTabsRestorationContext';
import { useMutationObserver } from 'hooks/useMutationObserver';
import { unstable_batchedUpdates } from 'react-dom';
import { arrayExclusion } from 'utils/array';

interface WzTabsElementEventMap {
  tabActive: CustomEvent<{ isActive: true }>;
  tabEnabled: CustomEvent<void>;
  tabDisabled: CustomEvent<void>;
}
type WzTabsElement = CustomElement<WzTabsElementEventMap>;

export interface WzTabs {
  activateTabByIndex(tabIndex: number): void;
  activateTabById(tabId: string): void;
}

export interface WzTabsProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<Element>, Element>, 'ref'> {
  ref?: Ref<WzTabs>;

  children:
    | ReactElement<ReactElement<WzTabProps>>
    | Iterable<ReactElement<ReactElement<WzTabProps>>>;

  fixed?: boolean;
  restorationId?: symbol | string;

  onTabActive?(event: CustomEvent<{ isActive: true }>): void;
  onTabEnabled?(event: CustomEvent<void>): void;
  onTabDisabled?(event: CustomEvent<void>): void;
}

export function WzTabs({
  ref,
  children,
  fixed,
  restorationId,
  onTabActive,
  onTabEnabled,
  onTabDisabled,
  ...rest
}: WzTabsProps) {
  assertWzTabChildren(children);

  const tabsRestorationMap = useContext(WzTabsRestorationContext);
  const tabsRef = useRef<WzTabsElement>(null);

  useWzTabsEventListener(
    'tabActive',
    (evt) => {
      const tab = evt.target as Element;
      if (!isWzTab(tab)) {
        console.error(
          'tabActive event has been triggered by ',
          tabsRef.current,
          ' but the event target is of unexpected type ',
          tab,
        );
        return;
      }

      const tabId = tab.getAttribute('data-tab-id');
      if (restorationId && tabId) tabsRestorationMap.set(restorationId, tabId);

      onTabActive?.(evt);
    },
    tabsRef,
  );
  useWzTabsEventListener('tabEnabled', onTabEnabled, tabsRef);
  useWzTabsEventListener('tabDisabled', onTabDisabled, tabsRef);

  const mountedTabs = useMountedTabs(tabsRef.current);

  const activateTabByIndex = useCallback(
    (tabIndex: number): boolean => {
      if (tabIndex > mountedTabs.length - 1) return false;

      for (let i = 0; i < mountedTabs.length; i++) {
        setWzTabActive(mountedTabs[i], i === tabIndex);
      }

      return true;
    },
    [mountedTabs],
  );
  const activateTabById = useCallback(
    (tabId: string): boolean => {
      let tabIndex: number | null = null;
      for (let i = 0; i < mountedTabs.length; i++) {
        if (tabIndex !== null) {
          // we found the tab already, so now we can set all the other tabs to non active state
          setWzTabActive(mountedTabs[i], false);
          continue;
        }

        const mountedTab = mountedTabs[i];
        if (mountedTab.getAttribute('data-tab-id') !== tabId) continue;
        tabIndex = i;
        setWzTabActive(mountedTab, true);
      }

      if (tabIndex !== null) {
        // the desired tab has been activated, but now we need to deactivate all tabs before it
        for (let i = 0; i < tabIndex; i++)
          setWzTabActive(mountedTabs[i], false);
      }

      return tabIndex !== null;
    },
    [mountedTabs],
  );

  const activateDefaultTab = useCallback((): boolean => {
    const tabIdToRestore =
      restorationId ? tabsRestorationMap.get(restorationId) : null;

    if (!tabIdToRestore || !activateTabById(tabIdToRestore))
      return activateTabByIndex(0);

    return true;
  }, [activateTabById, activateTabByIndex, restorationId, tabsRestorationMap]);

  useEffect(() => {
    if (!mountedTabs.some((tab) => isWzTabActive(tab))) activateDefaultTab();
  }, [activateDefaultTab, mountedTabs]);

  useImperativeHandle(
    ref,
    () => ({
      activateTabByIndex,
      activateTabById,
    }),
    [activateTabByIndex, activateTabById],
  );

  return (
    <wz-tabs fixed={fixed} ref={tabsRef} {...rest}>
      {children}
    </wz-tabs>
  );
}

function assertWzTabChildren(children: ReactNode): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== WzTab) {
      throw new Error('WzTabs children must be WzTab components');
    }
  });
}

function useWzTabsEventListener<K extends keyof WzTabsElementEventMap>(
  type: K,
  listener: ((event: WzTabsElementEventMap[K]) => void) | undefined | null,
  elementRef: RefObject<WzTabsElement | null>,
): void {
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (listener) element?.addEventListener(type, listener);

    return () => {
      if (listener) element?.removeEventListener(type, listener);
    };
  }, [elementRef, listener, type]);
}

function useMountedTabs(
  tabsElement: WzTabsElement | null,
): ReadonlyArray<Element> {
  const queryAllTabs = useCallback(() => {
    if (!tabsElement) return [];
    return Array.from(tabsElement.getElementsByTagName('wz-tab'));
  }, [tabsElement]);

  const [mountedTabs, setMountedTabs] = useState(queryAllTabs);

  useEffect(() => {
    setMountedTabs(queryAllTabs);
  }, [queryAllTabs]);

  useMutationObserver(
    tabsElement,
    (mutations) => {
      unstable_batchedUpdates(() => {
        mutations.forEach((mutation) => {
          const addedTabs = Array.from(mutation.addedNodes).filter(isWzTab);
          const removedTabs = Array.from(mutation.removedNodes).filter(isWzTab);
          setMountedTabs((mountedTabs) => [
            ...arrayExclusion(mountedTabs, removedTabs),
            ...addedTabs,
          ]);
        });
      });
    },
    {
      childList: true,
    },
  );

  return mountedTabs;
}

function isWzTab(node: Node): node is Element {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as Element).tagName === 'wz-tab'
  );
}

function isWzTabActive(tabElement: Element): boolean {
  const attributeName = 'is-active';
  return (
    tabElement.hasAttribute(attributeName) &&
    tabElement.getAttribute(attributeName) !== 'false'
  );
}

function setWzTabActive(tabElement: Element, isActive: boolean) {
  const attributeName = 'is-active';
  tabElement.setAttribute(attributeName, isActive ? '' : 'false');
}
