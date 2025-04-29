import { KeysOfFunctions } from '../keys-of-type.js';
import { InterceptionFunction } from '../method-interceptor.js';

export const RETURN_ORIGINAL_VALUE: unique symbol = Symbol(
  'RETURN ORIGINAL INVOCATION VALUE',
);

export function interceptAfterInvocation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Target extends Record<string, (...args: any[]) => any>,
  FnKey extends KeysOfFunctions<Target>,
>(
  invocator: (
    this: ThisType<Target[FnKey]>,
    result: ReturnType<Target[FnKey]>,
    ...args: Parameters<Target[FnKey]>
  ) => ReturnType<Target[FnKey]> | typeof RETURN_ORIGINAL_VALUE,
): InterceptionFunction<Target, FnKey> {
  return function (invoke, ...args) {
    const origInvocationResult = invoke.apply(this, args);
    const customInvocatorResult = invocator.call(
      this,
      origInvocationResult,
      ...args,
    );
    if (customInvocatorResult !== RETURN_ORIGINAL_VALUE)
      return customInvocatorResult;

    return origInvocationResult;
  };
}
