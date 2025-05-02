import { Fiber } from 'react-reconciler';

const FIBER_KEY_PREFIX = '__reactFiber$';

/**
 * Extracts the {@link Fiber React Fiber} node from a {@link HTMLElement DOM element}
 * @param element The React rendered DOM element to extract the Fiber from
 * @returns The Fiber node associated with the DOM element
 * @throws An error if a Fiber node cannot be found for this element
 */
export function getFiber(element: HTMLElement) {
  const fiberKey = Object.keys(element).find((key) => key.startsWith(FIBER_KEY_PREFIX));
  if (!fiberKey) {
    throw new Error(`No fiber key found for element: ${element}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fiber = (element as any)[fiberKey] as Fiber;
  if (!fiber) {
    throw new Error(`No fiber found for element: ${element}`);
  }

  return fiber;
}
