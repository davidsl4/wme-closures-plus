import { useMemo, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Set<T> extends Iterable<T> {
  values(): T[];
  add(value: T): void;
  clear(): void;
  delete(value: T): void;
  has(value: T): boolean;
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<S extends T>(
    predicate: (value: T, index: number, array: Set<T>) => value is S,
    thisArg?: any,
  ): this is Set<S>;
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every(
    predicate: (value: T, index: number, array: Set<T>) => unknown,
    thisArg?: any,
  ): boolean;
  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some(
    predicate: (value: T, index: number, array: Set<T>) => unknown,
    thisArg?: any,
  ): boolean;

  readonly size: number;
}

export function useSet<T>(initialValues: Iterable<T>): Set<T> {
  const [state, setState] = useState<ReadonlySet<T>>(new Set(initialValues));

  const memoizedSet: Set<T> = useMemo(() => {
    const set = {
      [Symbol.iterator]() {
        return state.values();
      },
      values() {
        return Array.from(state.values());
      },
      add(value) {
        setState((set) => {
          if (set.has(value)) return set;
          const newSet = new Set(set);
          newSet.add(value);
          return newSet;
        });
      },
      clear() {
        setState((set) => {
          if (set.size === 0) return set;
          return new Set();
        });
      },
      delete(value) {
        setState((set) => {
          if (!set.has(value)) return set;
          const newSet = new Set(set);
          newSet.delete(value);
          return newSet;
        });
      },
      has(value) {
        return state.has(value);
      },
      some(predicate, thisArg) {
        let i = 0;
        for (const value in state) {
          if (predicate.call(thisArg, value, i, this)) return true;
          i++;
        }

        return false;
      },
      // @ts-expect-error Because of type mismatch with type predicate
      every(predicate, thisArg) {
        let i = 0;
        for (const value of state) {
          if (!predicate.call(thisArg, value, i, this)) return false;
          i++;
        }

        return true;
      },

      get size() {
        return state.size;
      },
    } satisfies Set<T>;

    return set as unknown as Set<T>;
  }, [state]);

  return memoizedSet;
}
