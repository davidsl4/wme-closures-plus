import { Fiber } from 'react-reconciler';

/**
 * Retrieves the props of a given fiber.
 * @param fiber The fiber to retrieve the props from.
 * @returns The props of the fiber.
 */
export function getFiberProps(fiber: Fiber): Record<string, any> {
  return fiber.memoizedProps || {};
}
