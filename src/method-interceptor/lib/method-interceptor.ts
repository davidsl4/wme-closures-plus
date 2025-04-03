/* eslint-disable @typescript-eslint/no-empty-object-type */
import { KeysOfFunctions, FunctionOfTarget } from './keys-of-type.js';
import { PropertySwapper } from './property-swapper.js';

export type InterceptionFunction<
  Target,
  FnKey extends KeysOfFunctions<Target>,
> = (
  this: ThisType<Target[FnKey]>,
  invoke: Target[FnKey],
  ...args: Parameters<FunctionOfTarget<Target, FnKey>>
) => ReturnType<FunctionOfTarget<Target, FnKey>>;

export type MethodInterceptorMiddleware<
  Target extends object,
  FnKey extends KeysOfFunctions<Target>,
> = (...args: Parameters<FunctionOfTarget<Target, FnKey>>) =>
  | {
      input: Parameters<FunctionOfTarget<Target, FnKey>>;
    }
  | {
      output: ReturnType<FunctionOfTarget<Target, FnKey>>;
    }
  | {}
  | undefined
  | void
  | null;

export class MethodInterceptor<
  Target extends object,
  FnKey extends KeysOfFunctions<Target>,
> {
  private _enabled = false;
  private _fnSwapper: PropertySwapper<
    Target,
    FnKey,
    FunctionOfTarget<Target, FnKey>
  >;
  private _interceptionFunction: InterceptionFunction<Target, FnKey>;
  private _middlewares: MethodInterceptorMiddleware<Target, FnKey>[] = [];

  constructor(
    targetObject: Target,
    functionName: FnKey,
    interceptionFunction: InterceptionFunction<Target, FnKey>,
  ) {
    this._fnSwapper = new PropertySwapper(targetObject, functionName);
    this._interceptionFunction = interceptionFunction;
  }

  get enabled() {
    return this._fnSwapper.isSwapped && this._enabled;
  }

  disable() {
    this._enabled = false;
    if (!this.enabled) return;
  }

  restore() {
    this._fnSwapper.restore();
  }

  enable() {
    this._enabled = true;
    if (!this._fnSwapper.isSwapped) this.swapToInterceptor();
  }

  private swapToInterceptor() {
    this._fnSwapper.swap(((
      ...args: Parameters<FunctionOfTarget<Target, FnKey>>
    ) => {
      // If the interceptor is disabled, we still want to process it ourselves in case someone has
      // also overriden our own "interceptor", so if we would restore the original function
      // their interceptor would also be ripped off, potentially leading to weird bugs
      // By checking whether our interceptor is disabled, and invoking the original function
      // we guarantee that interceptors registered afterwards are still can be trigerred
      // and they just would trigger the original function, as we never have touched anything
      if (!this._enabled) return this.callOriginalInvocator(...args);

      const middlewaresResult = this.runMiddlewares(args);
      if (middlewaresResult) {
        if ('output' in middlewaresResult) return middlewaresResult.output;
        if ('input' in middlewaresResult) args = middlewaresResult.input;
      }

      return this._interceptionFunction.call(
        this._fnSwapper.target,
        this.getOriginalInvocator(),
        ...args,
      );
    }) as Target[FnKey]);
  }

  private getOriginalInvocator(): FunctionOfTarget<Target, FnKey> {
    return this._fnSwapper.originalValue.bind(
      this._fnSwapper.target,
    ) as FunctionOfTarget<Target, FnKey>;
  }

  callOriginalInvocator(
    ...args: Parameters<FunctionOfTarget<Target, FnKey>>
  ): ReturnType<FunctionOfTarget<Target, FnKey>> {
    return this.getOriginalInvocator()(...args);
  }

  private runMiddlewares(
    args: Parameters<FunctionOfTarget<Target, FnKey>>,
  ): ReturnType<(typeof this._middlewares)[number]> {
    for (const middleware of this._middlewares) {
      const result = middleware(...args);
      if (!result) continue;
      if ('output' in result) return result;
      if ('input' in result) args = result.input;
    }

    return { input: args };
  }

  registerMiddleware(middleware: MethodInterceptorMiddleware<Target, FnKey>) {
    this._middlewares.push(middleware);
  }
}
