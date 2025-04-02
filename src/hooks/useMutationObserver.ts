import { useEffect, useMemo } from 'react';
import { useEventCallback } from 'usehooks-ts';

interface UseMutationObserverOptions extends MutationObserverInit {
  cleanUp?: () => void;
}
export function useMutationObserver(
  target: Node | undefined | null,
  callback: (mutations: MutationRecord[], observer: MutationObserver) => void,
  { cleanUp, ...initOptions }: UseMutationObserverOptions,
): void {
  const eventCallback = useEventCallback(callback);
  const observer = useMemo(() => {
    return new MutationObserver(eventCallback);
  }, [eventCallback]);

  useEffect(() => {
    if (target) observer.observe(target, initOptions);

    return () => {
      observer.disconnect();
    };
  }, [observer, initOptions, target, cleanUp]);
}
