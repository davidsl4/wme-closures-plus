import { ReactNode, SyntheticEvent } from 'react';
import { Day } from './enums';
import { graceCheckboxBehavior } from 'utils/grace-checkbox-handler';

export interface DayCheckboxProps {
  day: Day;
  checked: boolean;
  onChange: (newState: boolean) => void;
  children: ReactNode;
}
export function DayCheckbox(props: DayCheckboxProps) {
  const handleChange = graceCheckboxBehavior(
    (event: SyntheticEvent<HTMLInputElement>) => {
      event.preventDefault();
      props.onChange(event.currentTarget.checked);
    },
  );

  return (
    <wz-checkbox checked={props.checked} onChange={handleChange}>
      {props.children}
    </wz-checkbox>
  );
}
