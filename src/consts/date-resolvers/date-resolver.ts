export interface DateResolverProperties<N extends string = string, A = any> {
  name: N;
  args: A;
}

export interface DateResolver<N extends string = string, A = any> {
  name: N;
  resolve(args: A): Date;
}

export function createDateResolver<A, N extends string>(
  name: N,
  resolve: (args: A) => Date
): DateResolver<N, A> {
  return {
    name,
    resolve,
  };
}
