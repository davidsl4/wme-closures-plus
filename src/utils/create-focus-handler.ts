import { EventHandler, RefObject, SyntheticEvent } from 'react';

export function createFocusHandler(
  targetRef: RefObject<HTMLElement>,
): EventHandler<SyntheticEvent> {
  return (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    targetRef.current?.focus();
  };
}
