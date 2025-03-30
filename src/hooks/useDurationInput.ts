import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface DurationModifier {
  modifier: string;
  multiplier: number;
}

interface UseDurationInputOptions {
  value?: number;
  onChange?: (value: number) => void;
  modifiers: DurationModifier[];
}
export function useDurationInput({
  value,
  onChange,
  modifiers,
}: UseDurationInputOptions) {
  const [compoundValue, setCompoundValue] = useState({
    input: '',
    numeric: NaN,
  });
  // const [selectedComponentIndex, setSelectedComponentIndex] = useState<
  //   number | null
  // >(null);
  const { formatDuration, parseDuration } = useDurationModifiers(modifiers);
  const [error, setError] = useState<null | 'INVALID_PATTERN'>(null);

  useEffect(() => {
    // A self invoking function to be able to use return statements freely
    (() => {
      if (typeof value !== 'number' || isNaN(value)) return;

      const parsedValue = parseDuration(compoundValue.input);
      if (parsedValue === value) return;
      setCompoundValue({
        input: formatDuration(value),
        numeric: value,
      });
    })();
  }, [compoundValue.input, formatDuration, parseDuration, value]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numericValue = parseDuration(newValue);
    onChange?.(numericValue);
    setCompoundValue({
      input: newValue,
      numeric: numericValue,
    });
    setError((currentError) =>
      currentError === 'INVALID_PATTERN' ? null : currentError,
    );
  };

  const handleInputBlur = () => {
    if (!isNaN(compoundValue.numeric)) return setError(null);
    const numericValue = parseDuration(compoundValue.input);
    if (!isNaN(numericValue)) return setError(null);
    setError('INVALID_PATTERN');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const components = event.currentTarget.value.split(' ');
    const componentPositions = components.reduce(
      (acc, component) => {
        const lastPos = acc.length > 0 ? acc[acc.length - 1].end : 0;
        const nextStart = lastPos + (acc.length > 0 ? 1 : 0); // Add 1 for the space
        const nextEnd = nextStart + component.length;
        acc.push({ start: nextStart, end: nextEnd });
        return acc;
      },
      [] as { start: number; end: number }[],
    );

    const currentCursorPos = event.currentTarget.selectionStart ?? 0;
    const componentIndexAtCurrentCursorPos = componentPositions.reduce(
      (index, currentComponent, currentIndex) => {
        if (
          currentCursorPos >= currentComponent.start &&
          currentCursorPos <= currentComponent.end
        )
          return currentIndex;

        return index;
      },
      -1,
    );

    const selectComponentByIndex = (componentIndex: number) => {
      event.currentTarget.setSelectionRange(
        componentPositions[componentIndex].start,
        componentPositions[componentIndex].end,
      );
    };

    const selectComponentByRelativeIndex = (relativeComponentIndex: number) => {
      if (componentIndexAtCurrentCursorPos === -1) return false;
      const targetIndex =
        componentIndexAtCurrentCursorPos + relativeComponentIndex;
      if (targetIndex < 0 || targetIndex >= componentPositions.length)
        return false;
      selectComponentByIndex(targetIndex);
      return true;
    };

    // const incrementCurrentComponent = (
    //   input: HTMLInputElement,
    //   incrementBy: number,
    // ) => {
    //   if (componentIndexAtCurrentCursorPos === -1) return;
    //   const component = components[componentIndexAtCurrentCursorPos];

    //   let valueStr = '';
    //   let modifier = '';
    //   for (let i = 0; i < component.length; i++) {
    //     const char = component[i];
    //     if (char >= '0' && char <= '9') {
    //       valueStr += char;
    //     } else {
    //       modifier += char;
    //     }
    //   }
    //   const value = parseInt(valueStr, 10);
    //   const modifierData = modifiers.find((m) => m.modifier === modifier);
    //   if (!modifierData) return;

    //   const newValue = value + incrementBy;
    //   const newComponentString = `${newValue}${modifier}`;
    //   components[componentIndexAtCurrentCursorPos] = newComponentString;
    //   const newValueString = components.join(' ');
    //   const newValueNumeric = parseDuration(newValueString);
    //   input.value = newValueString;
    //   setCompoundValue({
    //     input: newValueString,
    //     numeric: newValueNumeric,
    //   });

    //   // Find the position of the modified component
    //   let start = 0;
    //   for (let i = 0; i < componentIndexAtCurrentCursorPos; i++) {
    //     if (i !== 0) start += 1;
    //     start += components[i].length; // +1 for the space
    //   }
    //   const end = start + newComponentString.length;
    //   input.setSelectionRange(start, end);
    // };

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        selectComponentByRelativeIndex(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        selectComponentByIndex(1);
        break;
      // case 'ArrowUp':
      //   event.preventDefault();
      //   incrementCurrentComponent(event.currentTarget, 1);
      //   break;
      // case 'ArrowDown':
      //   event.preventDefault();
      //   incrementCurrentComponent(event.currentTarget, -1);
      //   break;
    }
  };

  return {
    inputValue: compoundValue.input,
    numericValue: compoundValue.numeric,
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    onKeyDown: handleKeyDown,
    error,
  };
}

function useDurationModifiers(modifiers: DurationModifier[]) {
  const sortedModifiers = modifiers.toSorted(
    (a, b) => b.multiplier - a.multiplier,
  );

  const formatDuration = useCallback(
    (duration: number): string => {
      if (typeof duration !== 'number' || isNaN(duration)) return '';

      let remainingDuration = duration;
      const formattedComponents: string[] = [];

      for (const { modifier, multiplier } of sortedModifiers) {
        if (remainingDuration < multiplier) continue;
        const componentValue = Math.floor(remainingDuration / multiplier);
        formattedComponents.push(`${componentValue}${modifier}`);
        remainingDuration %= multiplier;
      }

      return formattedComponents.join(' ');
    },
    [sortedModifiers],
  );

  const parseDuration = useCallback(
    (input: string): number => {
      if (!input) return NaN;

      const components = input.split(' ');
      return components.reduce((totalDuration, component) => {
        component = component.trim();
        if (!component) return totalDuration;

        let valueStr = '',
          modifier = '';
        for (let i = 0; i < component.length; i++) {
          const char = component[i];
          if (char >= '0' && char <= '9') valueStr += char;
          else modifier += char;
        }

        const value = parseInt(valueStr);
        const modifierData = sortedModifiers.find(
          (m) => m.modifier === modifier,
        );

        if (isNaN(value) || !modifierData) return NaN;

        return totalDuration + value * modifierData.multiplier;
      }, 0);
    },
    [sortedModifiers],
  );

  return {
    formatDuration,
    parseDuration,
  };
}
