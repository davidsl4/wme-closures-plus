import { DateOnly } from 'classes';

export interface DateResolverProperties<N extends string = string, A = any> {
  name: N;
  args: A;
}

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
  name: D['name'];
  args: Parameters<D['resolve']>[0];
};
