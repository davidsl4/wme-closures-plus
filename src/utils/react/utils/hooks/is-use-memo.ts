import { DependencyList } from 'react';
import { BaseHookValue } from './base-hook-value.js';

interface UseMemoHookValue<V> extends BaseHookValue {
  memoizedState: [V, DependencyList];
  queue: null;
}

/**
 * Checks if the given hook value (memoizedState of a Fiber) is a result of a useMemo hook.
 * @param hookValue The hook value to check.
 * @returns True if the hook value is a useMemo hook value, false otherwise.
 */
export function isUseMemo<V>(hookValue: unknown): hookValue is UseMemoHookValue<V> {
  // A useMemo hook value will have a memoizedState property which is a tuple containing two elements:
  // 1. The memoized value.
  // 2. The dependency list (an array).
  // The queue property will be null.

  return (
    typeof hookValue === 'object' &&
    hookValue !== null &&
    'memoizedState' in hookValue &&
    Array.isArray(hookValue.memoizedState) &&
    hookValue.memoizedState.length === 2 &&
    'queue' in hookValue &&
    hookValue.queue === null &&
    Array.isArray(hookValue.memoizedState[1]) // Check if the second element is an array (the dependency list)
  );
}
