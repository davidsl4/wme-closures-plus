import { EventHandler, SyntheticEvent } from 'react';

export function graceCheckboxBehavior(
  eventHandler: EventHandler<SyntheticEvent<HTMLInputElement>>,
): EventHandler<SyntheticEvent<HTMLInputElement>> {
  return (event) => {
    const newCheckedState = event.currentTarget.checked;

    eventHandler(event);

    if (!event.isDefaultPrevented()) return;

    event.currentTarget.checked = !newCheckedState;
  };
}
