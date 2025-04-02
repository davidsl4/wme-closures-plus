import { RefObject, useCallback, useRef, useState } from 'react';
import { useMutationObserver } from './useMutationObserver';

export interface TrackableElement<E extends Element = Element> {
  id: number;
  element: E;
}

export function useQuerySelectorAll<E extends Element = Element>(
  target: Element | undefined | null,
  selector: string,
  filter?: (element: Element) => element is E,
): ReadonlyArray<TrackableElement<E>> {
  const [, generateId] = useGeneratableId();
  const [trackedElements, setTrackedElements] = useState<TrackableElement<E>[]>(
    [],
  );

  const getAllElements: () => E[] = useCallback(() => {
    const matchingNodes = Array.from(target.querySelectorAll(selector));
    if (filter) return matchingNodes.filter(filter);
    return matchingNodes as E[];
  }, [filter, selector, target]);

  const updatedTrackedNodes = useCallback(
    (elements: E[] = getAllElements()) => {
      setTrackedElements((trackedElements) => {
        const trackedElementsAfterRemoval = trackedElements.filter(
          ({ element: trackedElement }) => elements.includes(trackedElement),
        );
        const hasRemovedElements =
          trackedElementsAfterRemoval.length < trackedElements.length;

        const elementsToAdd = elements.filter(
          (element) =>
            !trackedElements.some(
              ({ element: trackedElement }) => element === trackedElement,
            ),
        );
        if (!hasRemovedElements && !elementsToAdd.length)
          return trackedElements;

        const elementsToAddAsTrackable = elementsToAdd.map((element) => ({
          element,
          id: generateId(),
        }));

        const newTrackedElements = [
          ...trackedElementsAfterRemoval,
          ...elementsToAddAsTrackable,
        ];

        return newTrackedElements;
      });
    },
    [generateId, getAllElements],
  );

  useMutationObserver(
    target,
    () => {
      updatedTrackedNodes();
    },
    {
      childList: true,
      subtree: true,
    },
  );

  return trackedElements;
}

function useGeneratableId(): [
  lastGeneratedId: RefObject<number>,
  generate: () => number,
] {
  const lastGeneratedId = useRef(0);
  const generateId = useCallback(() => {
    return lastGeneratedId.current++;
  }, [lastGeneratedId]);

  return [lastGeneratedId, generateId] as const;
}
