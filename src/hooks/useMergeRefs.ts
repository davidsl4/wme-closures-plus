import { Ref, RefObject, RefCallback, useCallback } from 'react';

/**
 * Type guard to check if a ref is a callback ref.
 */
function isCallbackRef<T>(ref: Ref<T>): ref is RefCallback<T> {
  return typeof ref === 'function';
}

/**
 * Type guard to check if a ref is a mutable ref object.
 */
function isRefObject<T>(ref: Ref<T>): ref is RefObject<T | null> {
  // Check if it's an object, not null, and has a 'current' property.
  return ref != null && typeof ref === 'object' && 'current' in ref;
}

/**
 * Custom Hook that merges multiple refs (Ref<T>) into a single callback ref.
 * This is useful for scenarios like combining a forwarded ref with a local ref.
 *
 * @template T The type of the element or component instance being reffed.
 * @param refs An array of refs (callback refs or ref objects) to be merged.
 * Null or undefined values in the array are ignored.
 * @returns A single memoized callback ref (RefCallback<T>) that, when called
 * with a value, assigns that value to all valid input refs.
 */
export function useMergeRefs<T>(
  ...refs: ReadonlyArray<Ref<T> | undefined | null>
): RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    createMergeRefs(...refs),
    // The refs array is the dependency for useCallback.
    // Spreading ensures stability if the array instance changes
    // but contains the same refs.
    // Eslint disable might be needed as linters sometimes struggle
    // with refs in dependency arrays.
    [...refs],
  );
}

export function createMergeRefs<T>(
  ...refs: ReadonlyArray<Ref<T> | undefined | null>
): RefCallback<T> {
  return (value: T | null) => {
    // Iterate through all the refs passed in the array
    refs.forEach((ref) => {
      if (!ref) {
        // Ignore null or undefined refs
        return;
      }

      if (isCallbackRef(ref)) {
        // If it's a callback ref, call it with the value
        ref(value);
      } else if (isRefObject(ref)) {
        // If it's a ref object, assign the value to its .current property
        // We know 'current' exists because of the type guard.
        ref.current = value;
      }
      // Note: String refs are legacy and not handled here.
      // They are generally discouraged.
    });
  };
}
