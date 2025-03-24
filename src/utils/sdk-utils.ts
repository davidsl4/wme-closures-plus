import { getWindow } from './window-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractFunctionType<T> = T extends (...args: any[]) => any ? T : never;
type WmeSdkResolverFunction = ExtractFunctionType<typeof window.getWmeSdk>;

const window = getWindow();
export const SDK_INITIALIZED = window.SDK_INITIALIZED;
export function getWmeSdk(
  ...args: Parameters<WmeSdkResolverFunction>
): ReturnType<WmeSdkResolverFunction> {
  return window.getWmeSdk?.(...args);
}
