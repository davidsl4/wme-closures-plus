import { TrackableElement, useQuerySelectorAll } from 'hooks';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { arrayExclusion } from 'utils/array';
import { isElementNode } from 'utils/node-utils';

export interface UInjectorRenderUIOptions {
  /** The target DOM element for which the UI will be injected */
  target: Element;
}

export interface UInjectorProps {
  /**
   * Specifies the container to observe for mutations. Either a direct {@link Element} node,
   * or a {@link String string} representing the query selector for the container.
   */
  observedContainer?: Element | string;

  /**
   * Specifies the query selector of the target node for injection (where the UI shall be rendered).
   *
   * While {@link observedContainer} defines the root element we want to track, this {@link targetSelector} property will
   * define the actual node (which must be a child somewhere in the subtree of the {@link observedContainer}) where we
   * want our custom UI to be injected.
   */
  targetSelector: string;

  /**
   * An optional filter function to filter out unwanted targets returned by using the {@link targetSelector}.
   * @param element An element matching the {@link targetSelector}.
   * @returns `True` when the element shall be included, or `False` otherwise.
   */
  // targetFilter?<E extends Element = Element>(element: E): element is E;
  targetFilter?(element: Element): boolean;

  /**
   * Defines where the UI should be rendered relative to the {@link targetSelector}.
   *
   * Valid values are:
   * - `AFTER` - Inserts your UI as a sibling element immediately after the target container.
   * - `BEFORE` - Inserts your UI as a sibling element immediately before the target container.
   * - `INSIDE-START` - Inserts your UI as the first child of the target container.
   * - `INSIDE-END` - Inserts your UI as the last child of the target container.
   * - `REPLACE` - Replaces the target container with your UI. The target container will be hidden using the `display` CSS property set to `none`.
   *
   * The default value if omitted is set to `INSIDE-END`, meaning your UI will be inserted as the last child of the target container.
   */
  position?: 'AFTER' | 'BEFORE' | 'INSIDE-START' | 'INSIDE-END' | 'REPLACE';

  /**
   * A function that renders the UI to be injected into the target container.
   * @param options The options object containing the target element.
   * @returns The React node to render.
   */
  renderUI(options: UInjectorRenderUIOptions): ReactNode;

  /**
   * Should the injector wrap your target UI within its own container.
   * By default this is `True`, but disabling it provides you more flexibility over the injected UI elements, however at the price
   * of potential issues with elements positioning. If you disables it you MUST ensure your top-level UI elements will never change in place,
   * nor new elements will be mounted to the UI (or unmounted just to remount at some point later).
   *
   * If you want to transform the wrapping container use {@link containerTransformer} as it is a much safer alternative allowing to
   * implement some minor changes to the target container (such as adding a class or a direct style).
   */
  wrapInContainer?: boolean;

  /**
   * Defines an optional transformer function which transforms
   * the wrapping container element to better fit your requirements (such as adding a class or direct styles)
   * @param container The container in subject.
   * @returns An optional destructor function to revert the modifications.
   */
  containerTransformer?: (container: HTMLDivElement) => void | (() => void);
}
export function UInjector(props: UInjectorProps) {
  const containerToObserve: Element = useMemo(() => {
    if (!props.observedContainer) return document.body;

    if (typeof props.observedContainer !== 'string')
      return props.observedContainer;

    return document.querySelector(props.observedContainer);
  }, [props.observedContainer]);

  const matchingTargets = useQuerySelectorAll(
    containerToObserve,
    props.targetSelector,
    props.targetFilter as (element: Element) => element is Element,
  );
  const wrappingContainers = useWrappingContainers(
    matchingTargets,
    props.containerTransformer,
  );

  const moveNodesToTarget = useCallback(
    (childNodes: Node[], target: Element) => {
      switch (props.position) {
        case 'AFTER':
          target.after(...childNodes);
          break;
        case 'BEFORE':
          target.before(...childNodes);
          break;
        case 'REPLACE':
          if (target instanceof HTMLElement) target.style.display = 'hidden';

          target.after(...childNodes);
          break;
        case 'INSIDE-START':
          target.prepend(...childNodes);
          break;
        case 'INSIDE-END':
        default:
          target.append(...childNodes);
          break;
      }
    },
    [props.position],
  );

  useEffect(() => {
    if (!(props.wrapInContainer ?? true)) {
      const movedNodes: Array<{ node: Node; target: Element }> = [];

      const containerToTrackableElement = new Map<Element, TrackableElement>();
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (!isElementNode(mutation.target)) continue;

          const trackableTarget = containerToTrackableElement.get(
            mutation.target,
          );
          if (!trackableTarget) continue;

          const addedNodes = Array.from(mutation.addedNodes);
          moveNodesToTarget(addedNodes, trackableTarget.element);
          addedNodes.forEach((node) =>
            movedNodes.push({ node, target: trackableTarget.element }),
          );
        }
      });

      for (const [trackableTarget, wrappingContainer] of wrappingContainers) {
        const nodes = Array.from(wrappingContainer.childNodes);
        moveNodesToTarget(nodes, trackableTarget.element);
        observer.observe(wrappingContainer, { childList: true });
        nodes.forEach((node) =>
          movedNodes.push({ node, target: wrappingContainer }),
        );
      }

      return () => {
        observer.disconnect();
        for (const { node, target } of movedNodes) {
          target.append(node);
        }
      };
    } else {
      for (const [trackableTarget, wrappingContainer] of wrappingContainers) {
        moveNodesToTarget([wrappingContainer], trackableTarget.element);
      }
    }
  }, [moveNodesToTarget, props.wrapInContainer, wrappingContainers]);

  return Array.from(
    wrappingContainers,
    ([trackableElement, wrappingContainer]) => {
      const renderedUI = props.renderUI({
        target: trackableElement.element,
      });

      return createPortal(renderedUI, wrappingContainer, trackableElement.id);
    },
  );
}

function useWrappingContainers<E extends Element = Element>(
  matchingTargets: ReadonlyArray<TrackableElement<E>>,
  containerTransformer: UInjectorProps['containerTransformer'],
): ReadonlyMap<TrackableElement<E>, HTMLDivElement> {
  const oldMatchingTargets = useRef<typeof matchingTargets>(null);
  const [containersMap, setContainersMap] = useState<
    ReadonlyMap<TrackableElement<E>, HTMLDivElement>
  >(new Map());
  const transformedContainersMap = useRef<
    Map<
      HTMLDivElement,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      { transformer: Function; destructor: null | (() => void) }
    >
  >(new Map());

  useEffect(() => {
    (() => {
      if (oldMatchingTargets.current) {
        // Remove from the map any old matching targets that aren't included in the new set
        const obsoleteMatchingTargets = arrayExclusion(
          oldMatchingTargets.current,
          matchingTargets,
        );
        setContainersMap((containersMap) => {
          const entries = Array.from(containersMap.entries());
          return new Map(
            entries.filter(
              ([matchingTarget]) =>
                !obsoleteMatchingTargets.includes(matchingTarget),
            ),
          );
        });
      }

      // Add new targets to the map
      setContainersMap((containersMap) => {
        const targetsInMap = Array.from(containersMap.keys());
        const newMap = new Map(containersMap);
        const missingTargets = arrayExclusion(matchingTargets, targetsInMap);
        missingTargets.forEach((missingTarget) => {
          const container = document.createElement('div');
          newMap.set(missingTarget, container);
        });

        return newMap;
      });
    })();

    oldMatchingTargets.current = matchingTargets;
  }, [matchingTargets]);

  useEffect(() => {
    const containers = Array.from(containersMap.values());
    for (const container of containers) {
      const appliedTransformer =
        transformedContainersMap.current.get(container);
      if (appliedTransformer) {
        if (appliedTransformer.transformer === containerTransformer) continue;
        appliedTransformer?.destructor();
      }

      const destructor = containerTransformer?.(container);
      transformedContainersMap.current.set(container, {
        transformer: containerTransformer,
        destructor: destructor || null,
      });
    }
  }, [containerTransformer, containersMap]);

  return containersMap;
}
