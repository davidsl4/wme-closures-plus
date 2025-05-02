import { DependencyList } from 'react';
import { Fiber } from 'react-reconciler';
import { isUseMemo, isUseRef, isUseState } from '../utils/hooks';

export interface UseStateHook<V = unknown> {
  type: 'useState';
  value: V;
  dispatch: (action: V | ((prevState: V) => V)) => void;
}

export interface UseMemoHook<V = unknown> {
  type: 'useMemo';
  value: V;
  dependencies: DependencyList;
}

export interface UseRefHook<T = unknown> {
  type: 'useRef';
  current: T;
}

export type AnyHook = UseStateHook | UseMemoHook | UseRefHook;

function parseMemoizedStateValue(value: Fiber['memoizedState']): AnyHook | null {
  if (isUseState(value)) {
    return {
      type: 'useState',
      value: value.memoizedState,
      dispatch: value.queue.dispatch,
    }
  }

  if (isUseMemo(value)) {
    return {
      type: 'useMemo',
      value: value.memoizedState[0],
      dependencies: value.memoizedState[1],
    }
  }

  if (isUseRef(value)) {
    return {
      type: 'useRef',
      current: value.memoizedState,
    }
  }

  return null;
}

export function parseFiberHooks(fiber: Fiber): Array<AnyHook>;
export function parseFiberHooks<T extends AnyHook['type']>(fiber: Fiber, type: T): Array<Extract<AnyHook, { type: T }>>;
export function parseFiberHooks<T extends AnyHook['type']>(fiber: Fiber, type: T[]): Array<Extract<AnyHook, { type: T }>>;
export function parseFiberHooks(fiber: Fiber, types?: string | string[]): Array<AnyHook> {
  const hooks: Array<AnyHook> = [];

  let currentHook: Fiber['memoizedState'] | null = fiber.memoizedState;
  while (currentHook) {
    const parsedHook = parseMemoizedStateValue(currentHook);
    if (parsedHook) {
      if (!types) hooks.push(parsedHook);
      else if (typeof types === 'string' && parsedHook.type === types)
        hooks.push(parsedHook);
      else if (Array.isArray(types) && types.includes(parsedHook.type))
        hooks.push(parsedHook);
    }

    currentHook = currentHook.next;
  }

  return hooks;
}
