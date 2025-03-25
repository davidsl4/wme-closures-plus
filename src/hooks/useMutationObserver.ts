import { useEffect, useMemo } from 'react';

export function useMutationObserver(
  target: Node | undefined | null,
  callback: (mutations: MutationRecord[], observer: MutationObserver) => void,
  options: MutationObserverInit,
): void {
  const observer = useMemo(() => {
    return new MutationObserver(callback);
  }, [callback]);

  useEffect(() => {
    if (target) observer.observe(target, options);

    return () => {
      observer.disconnect();
    };
  }, [observer, options, target]);
}
