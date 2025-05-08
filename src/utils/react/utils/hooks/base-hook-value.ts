export interface BaseHookValue {
  baseState: unknown;
  baseQueue: unknown;
  memoizedState: unknown;
  queue: unknown;
  next: BaseHookValue | null;
}
