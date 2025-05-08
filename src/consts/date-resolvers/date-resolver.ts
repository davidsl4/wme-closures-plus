import { DateOnly } from 'classes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DateResolverProperties<N extends string = string, A = any> {
  name: N;
  args: A;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DateResolver<N extends string = string, A = any> {
  name: N;
  resolve(args: A): DateOnly;
}

export function createDateResolver<A, N extends string>(
  name: N,
  resolve: (args: A) => DateOnly,
): DateResolver<N, A> {
  return {
    name,
    resolve,
  };
}

export type SerializedDateResolver<D extends DateResolver = DateResolver> = {
  type: D['name'];
  args: Parameters<D['resolve']>[0];
};
