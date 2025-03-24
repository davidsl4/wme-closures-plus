import { Key, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function createSafePortal(
  children: ReactNode,
  container: Element | DocumentFragment | null,
  key?: Key | null,
) {
  if (!container) return null;
  return createPortal(children, container, key);
}
