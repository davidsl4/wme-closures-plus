import styled from '@emotion/styled';
import { RecurringModeFormProps } from '../recurring-mode';
import { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { DurationPicker } from 'components/DurationPicker';
import { formatMinutes, createFocusHandler } from 'utils';

const DurationsConfigContainer = styled('div')({
  display: 'flex',
  gap: 'var(--space-always-xs, 8px)',
  marginBottom: 'var(--space-always-xs, 8px)',

  'wz-text-input': {
    minWidth: 'unset',

    '&.duration': {
      flex: 1,
    },
    '&.interval': {
      flex: 1,
    },
  },
});

export function IntervalConfigForm(props: RecurringModeFormProps) {
  const [closureDuration, setClosureDuration] = useState<number>(
    typeof props.initialFieldValues?.closureDuration === 'number' ?
      props.initialFieldValues.closureDuration
    : NaN,
  );
  const closureDurationInputRef = useRef<HTMLInputElement>(null);
  const [intervalBetweenClosures, setIntervalBetweenClosures] =
    useState<number>(
      typeof props.initialFieldValues?.intervalBetweenClosures === 'number' ?
        props.initialFieldValues.intervalBetweenClosures
      : NaN,
    );
  const intervalBetweenClosuresInputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    props.fieldsValuesRef,
    () => ({
      closureDuration,
      intervalBetweenClosures,
    }),
    [closureDuration, intervalBetweenClosures],
  );

  useEffect(() => {
    props.setButtonState(
      'APPLY',
      !isNaN(closureDuration) && !isNaN(intervalBetweenClosures),
    );
  }, [closureDuration, intervalBetweenClosures, props]);

  return (
    <div>
      <DurationsConfigContainer>
        <DurationPicker
          ref={closureDurationInputRef}
          className="duration"
          label="Closure duration"
          value={closureDuration}
          onChange={setClosureDuration}
        />
        <DurationPicker
          ref={intervalBetweenClosuresInputRef}
          className="interval"
          label="Interval between closures"
          value={intervalBetweenClosures}
          onChange={setIntervalBetweenClosures}
        />
      </DurationsConfigContainer>

      <wz-caption>
        Creates multiple closures, each lasting{' '}
        <b>
          {isFinite(closureDuration) ?
            formatMinutes(closureDuration)
          : <wz-a onClick={createFocusHandler(closureDurationInputRef)}>
              {'<Closure duration>'}
            </wz-a>
          }
        </b>
        , starting every{' '}
        <b>
          {isFinite(intervalBetweenClosures) ?
            formatMinutes(intervalBetweenClosures)
          : <wz-a onClick={createFocusHandler(intervalBetweenClosuresInputRef)}>
              {'<Interval between closures>'}
            </wz-a>
          }
        </b>{' '}
        within the overall start and end times.
      </wz-caption>
    </div>
  );
}
