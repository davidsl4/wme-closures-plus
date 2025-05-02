import { useLayoutEffect } from 'react';

type CSSUnit = 'px' | 'em' | 'rem' | '%';

interface PaddingComponentStructuredValue {
  value: number;
  unit: CSSUnit;
}
type PaddingComponentValue =
  | number
  | `${number}${CSSUnit}`
  | PaddingComponentStructuredValue;

export function useChangeTabPadding(
  tabElement: HTMLElement,
  newPadding: PaddingComponentValue[] | string | number,
): PaddingComponentStructuredValue[] | null {
  const tabContainer = useTabShadowELement(tabElement);

  const originalPadding =
    tabContainer ? getComputedStyle(tabContainer).padding : null;
  const paddingValues =
    originalPadding ? parsePaddingValue(originalPadding) : null;

  useLayoutEffect(() => {
    const newPaddingValues = (() => {
      if (typeof newPadding === 'string') return parsePaddingValue(newPadding);
      if (typeof newPadding === 'number')
        return [{ value: newPadding, unit: 'px' }];

      return newPadding.map((paddingValue) => {
        if (typeof paddingValue === 'number') {
          return {
            value: paddingValue,
            unit: 'px',
          } as PaddingComponentStructuredValue;
        }
        if (typeof paddingValue === 'string') {
          return parsePaddingValue(paddingValue)[0];
        }
        return paddingValue;
      });
    })();

    // Apply the new padding values
    if (tabContainer)
      tabContainer.style.padding = `${newPaddingValues.map((val) => `${val.value}${val.unit}`).join(' ')}`;

    return () => {
      // Reset to original padding on cleanup
      if (tabContainer) tabContainer.style.padding = originalPadding;
    };
  }, [tabContainer, newPadding, originalPadding]);

  return paddingValues;
}

function parsePaddingValue(value: string): PaddingComponentStructuredValue[] {
  const paddingValues = value.split(' ').map((val) => {
    const match = val.match(/(\d+)([a-zA-Z%]+)/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2] as CSSUnit,
      } as const;
    }
    return { value: 0, unit: 'px' } as const; // Default to 0px if parsing fails
  });

  return paddingValues;
}

function useTabShadowELement(tabElement: HTMLElement): HTMLElement | null {
  if (tabElement?.tagName !== 'WZ-TAB') return null;

  const shadowRoot = tabElement.shadowRoot;
  if (!shadowRoot) return null;

  const tabContainer: HTMLElement = shadowRoot.querySelector('.wz-tab');
  if (!tabContainer) return null;

  return tabContainer;
}
