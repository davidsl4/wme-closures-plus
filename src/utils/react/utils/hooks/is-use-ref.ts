import { BaseHookValue } from './base-hook-value.js';

interface UseRefHookValue<T> extends BaseHookValue {
  memoizedState: {
    current: T;
  };
  queue: null;
}

/**
 * Checks if the given hook value (memoizedState of a Fiber) is a result of a useRef hook.
 * @param hookValue The hook value to check.
 * @returns True if the hook value is a useRef hook value, false otherwise.
 */
export function isUseRef<T>(
  hookValue: unknown,
): hookValue is UseRefHookValue<T> {
  // A useRef hook value will have a memoizedState property which is an object with a current property.
  // The queue property will be null.

  return (
    typeof hookValue === 'object' &&
    hookValue !== null &&
    'memoizedState' in hookValue &&
    typeof hookValue.memoizedState === 'object' &&
    hookValue.memoizedState !== null &&
    'current' in hookValue.memoizedState &&
    'queue' in hookValue &&
    hookValue.queue === null
  );
}
