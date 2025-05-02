import { Fiber } from 'react-reconciler';
import { BaseHookValue } from './base-hook-value.js';

interface PendingState<V> {
  action: V | ((prevState: V) => V);
  eagerReducer?: unknown;
  eagerState?: unknown;
  next: PendingState<V> | null;
}

interface UseStateHookValue<V> extends BaseHookValue {
  memoizedState: V;
  queue: {
    dispatch: (action: V | ((prevState: V) => V)) => void;
    pending: PendingState<V> | null;
  };
}

/**
 * Checks if the given hook value (memoizedState of a Fiber) is a result of a useState hook.
 * @param hookValue The hook value to check.
 * @returns True if the hook value is a useState hook value, false otherwise.
 */
export function isUseState<V>(hookValue: Fiber['memoizedState']): hookValue is UseStateHookValue<V> {
  // A useState hook value will have a memoizedState property (the type varies depending on the actual state)
  // and a queue property which is an object with a dispatch property, which is a function.

  return (
    typeof hookValue === 'object' &&
    hookValue !== null &&
    'memoizedState' in hookValue &&
    'queue' in hookValue &&
    typeof hookValue.queue === 'object' &&
    hookValue.queue !== null &&
    'dispatch' in hookValue.queue &&
    typeof hookValue.queue.dispatch === 'function'
  );
}
