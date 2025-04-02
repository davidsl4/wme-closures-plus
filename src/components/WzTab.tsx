import { useMutationObserver } from 'hooks/useMutationObserver';
import {
  cloneElement,
  DetailedHTMLProps,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useId,
  useRef,
} from 'react';

export interface WzTabProps
  extends DetailedHTMLProps<HTMLAttributes<Element>, Element> {
  [K: symbol & { __lock: 'WzTab' }]: never;

  id?: string;
  children?: ReactNode;
  label: ReactNode;
  tooltip?: string;
  disabled?: boolean;
}

export function WzTab({
  id,
  children,
  label,
  tooltip,
  disabled,
  ...rest
}: WzTabProps) {
  const isSimpleLabel = ['string', 'number', 'bigint'].includes(typeof label);

  const tabRef = useRef<Element>(null);
  const uniqueId = useId();
  const labelSlotName = `tab-label-${uniqueId}`;

  const tabsWrapperElement = tabRef.current?.parentElement;
  useMutationObserver(
    tabsWrapperElement?.shadowRoot,
    (mutations, observer) => {
      if (!mutations.length) return;

      const target = mutations[0].target as Element;

      if (!tabsWrapperElement || !tabRef.current) return;
      const tabElements = Array.from(
        tabsWrapperElement.getElementsByTagName('wz-tab'),
      );
      const currentTabElementIndex = tabElements.indexOf(tabRef.current);
      if (currentTabElementIndex === -1) return; // the tab is not added to the wrapper, wait for it to be added

      // get the .wz-tab-label element for this tab
      const tabLabelElement = target.querySelector(
        `.wz-tab-label:nth-child(${currentTabElementIndex + 1})`,
      );
      if (!tabLabelElement) return;

      // it has a "slot" element whose name is "tab-label-$index$", replace it with "tab-label-$id$"
      const slotElement = tabLabelElement.querySelector('slot');
      if (!slotElement) return;
      slotElement.setAttribute('name', labelSlotName);

      observer.disconnect();
    },
    { childList: true, subtree: true },
  );

  return (
    <>
      <wz-tab
        {...{ ['data-tab-id']: id }}
        ref={tabRef}
        disabled={disabled}
        label={isSimpleLabel ? label : undefined}
        tooltip={tooltip}
        {...rest}
      >
        {children}
      </wz-tab>
      {!isSimpleLabel &&
        (isValidElement(label) ?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cloneElement<any>(label, { slot: '' })
        : <wz-h7 slot="">{label}</wz-h7>)}
    </>
  );
}
