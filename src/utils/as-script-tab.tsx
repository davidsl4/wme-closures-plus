import React, { ComponentType, FunctionComponent, ReactElement } from 'react';
import { ScriptTab } from '../components/ScriptTab';
import { getDisplayName } from './get-display-name';

type DirectReactChildren = ReactElement | string | number;

export function asScriptTab<C extends ComponentType<P>, P extends object>(
  Component: C,
  tabLabel: DirectReactChildren,
  tabId?: string,
): FunctionComponent<P> {
  const tabbedComponent = (props: P) => {
    return (
      <ScriptTab tabId={tabId} tabLabel={tabLabel}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*// @ts-expect-error */}
        <Component {...props} />
      </ScriptTab>
    );
  };
  tabbedComponent.displayName = `ScriptTab(${getDisplayName(Component)})`;

  return tabbedComponent;
}
