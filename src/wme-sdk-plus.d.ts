import { WmeSDK } from 'wme-sdk-typings';

declare global {
  export function initWmeSdkPlus(
    wmeSdk: WmeSDK,
    options?: {
      hooks?: string[];
      immutable?: boolean;
    },
  ): Promise<WmeSDK>;
}
