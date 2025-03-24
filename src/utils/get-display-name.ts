import { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDisplayName(component: ComponentType<any>) {
  return component.displayName || component.name || 'Unknown';
}
