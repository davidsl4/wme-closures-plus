import { Fiber } from 'react-reconciler';
import { getFiberProps } from './get-fiber-props';
import {
  AnyHook,
  parseFiberHooks,
  UseMemoHook,
  UseRefHook,
  UseStateHook,
} from './parse-fiber-hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ParsedFiber<P extends object = Record<string, any>> {
  fiber: Fiber;
  hooks: {
    all: AnyHook[];
    useState: UseStateHook[];
    useMemo: UseMemoHook[];
    useRef: UseRefHook[];
  };
  props: P;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findParentFiber<P extends object = Record<string, any>>(
  startingFiber: Fiber,
  predicate: (fiber: ParsedFiber) => fiber is ParsedFiber<P>,
  maxDepth?: number,
): ParsedFiber<P>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findParentFiber<P extends object = Record<string, any>>(
  startingFiber: Fiber,
  predicate: (fiber: ParsedFiber) => boolean,
  maxDepth?: number,
): ParsedFiber<P>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findParentFiber<P extends object = Record<string, any>>(
  startingFiber: Fiber,
  predicate: (fiber: ParsedFiber) => boolean,
  maxDepth = Infinity,
): ParsedFiber<P> {
  let currentFiber: Fiber | null = startingFiber;
  let depth = 0;

  while (currentFiber && depth < maxDepth) {
    const hooks =
      currentFiber.memoizedState ? parseFiberHooks(currentFiber) : [];
    const props = getFiberProps(currentFiber);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const predicateSubject: ParsedFiber<any> = {
      fiber: currentFiber,
      hooks: {
        all: hooks,
        useState: hooks.filter(
          (hook): hook is UseStateHook => hook.type === 'useState',
        ),
        useMemo: hooks.filter(
          (hook): hook is UseMemoHook => hook.type === 'useMemo',
        ),
        useRef: hooks.filter(
          (hook): hook is UseRefHook => hook.type === 'useRef',
        ),
      },
      props,
    };

    if (predicate(predicateSubject)) {
      return predicateSubject;
    }

    currentFiber = currentFiber.return;
    depth++;
  }

  return null;
}
