import { SyntheticEvent } from 'react';
import { ALL_DAYS, NO_DAYS } from './consts/days-presets';
import { DayCheckbox } from './DayCheckbox';
import { Day } from './enums';
import styled from '@emotion/styled';

const AVAILABLE_DAYS = [
  { day: Day.Sunday, label: 'Sunday' },
  { day: Day.Monday, label: 'Monday' },
  { day: Day.Tuesday, label: 'Tuesday' },
  { day: Day.Wednesday, label: 'Wednesday' },
  { day: Day.Thursday, label: 'Thursday' },
  { day: Day.Friday, label: 'Friday' },
  { day: Day.Saturday, label: 'Saturday' },
];

const HeadlineContainer = styled('div')({
  display: 'flex',
  'wz-label': {
    flex: 1,
  },
});

export interface DaySelectorProps {
  value: readonly Day[];
  onDayChange: (day: Day, state: boolean) => void;
  onChange: (newValue: readonly Day[]) => void;
  label?: string;
  showShortcuts?: boolean;
}
export function DaySelector({
  value,
  onDayChange,
  onChange,
  label = 'Select days',
  showShortcuts = true,
}: DaySelectorProps) {
  const createShortcutButtonHandler = (days: readonly Day[]) => {
    return (event: SyntheticEvent<HTMLButtonElement>) => {
      event.currentTarget.blur();
      onChange(days);
    };
  };

  return (
    <div>
      <HeadlineContainer>
        <wz-label>{label}</wz-label>
        {showShortcuts && (
          <>
            <wz-button
              color="text"
              size="xs"
              onClick={createShortcutButtonHandler(ALL_DAYS)}
            >
              Select all
            </wz-button>
            <wz-button
              color="text"
              size="xs"
              onClick={createShortcutButtonHandler(NO_DAYS)}
            >
              Select none
            </wz-button>
          </>
        )}
      </HeadlineContainer>

      {AVAILABLE_DAYS.map(({ day, label }) => (
        <DayCheckbox
          key={day}
          day={day}
          checked={value.includes(day)}
          onChange={onDayChange.bind(null, day)}
        >
          {label}
        </DayCheckbox>
      ))}
    </div>
  );
}
