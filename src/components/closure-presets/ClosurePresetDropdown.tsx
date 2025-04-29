import { useClosurePresetsListContext } from 'contexts';
import { useManagedChangeableValue } from 'hooks/useManagedChangeableValue';
import { ClosurePreset } from 'interfaces/closure-preset';
import { SelectHTMLAttributes, useMemo } from 'react';

interface ClosurePresetDropdownProps {
  label: string;
  placeholder?: string;
  options?: ReadonlyArray<Readonly<ClosurePreset>>;
  selectedId?: ClosurePreset['id'];
  onSelect?(preset: ClosurePreset): void;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'placeholder'>;
}
export function ClosurePresetDropdown(props: ClosurePresetDropdownProps) {
  const options = useOptionsWithInheritance(props.options);
  const optionsMap = useOptionsMap(options);
  const selectValueProps = useManagedChangeableValue<HTMLSelectElement>({
    value: props.selectedId,
    onChange: (event) => {
      if (!optionsMap.has(event.target.value)) return;
      props.onSelect?.(optionsMap.get(event.target.value)!);
    },
  });

  return (
    <wz-select
      {...props.selectProps}
      label={props.label}
      placeholder={props.placeholder}
      {...selectValueProps}
    >
      {Array.from(optionsMap.values()).map((option) => (
        <wz-option key={option.id} value={option.id}>
          {option.name}
        </wz-option>
      ))}
    </wz-select>
  )
}

function useOptionsWithInheritance(
  options?: ReadonlyArray<Readonly<ClosurePreset>>,
) {
  const inheritedOptions = useClosurePresetsListContext()?.presets;
  return useMemo(() => {
    if (options) return options;
    return inheritedOptions;
  }, [options, inheritedOptions]);
}

function useOptionsMap(options?: ReadonlyArray<Readonly<ClosurePreset>>) {
  const optionsMap: ReadonlyMap<ClosurePreset['id'], ClosurePreset> = useMemo(() => {
    const map = new Map<ClosurePreset['id'], ClosurePreset>();
    options.forEach((option) => {
      map.set(option.id, option);
    });
    return map;
  }, [options]);

  return optionsMap;
}
