import { Timeframe } from 'interfaces';
import { RecurringMode } from '../recurring-mode';
import { IntervalConfigForm } from './IntervalConfigForm';

export const IntervalRecurringMode: RecurringMode = {
  id: 'INTERVAL',
  name: 'Interval-Based',
  formComponent: IntervalConfigForm,
  calculateClosureTimes: ({
    timeframe,
    fieldsValues: { closureDuration, intervalBetweenClosures },
  }) => {
    if (
      typeof closureDuration !== 'number' ||
      typeof intervalBetweenClosures !== 'number'
    )
      throw new Error('IntervalRecurringMode: Invalid field values');

    let nextClosureStartTime = timeframe.startDate;
    const closureTimeframes: Timeframe[] = [];

    while (true) {
      const nextClosureEndTime = addMinutes(
        nextClosureStartTime,
        closureDuration,
      );
      if (nextClosureEndTime > timeframe.endDate) break;
      closureTimeframes.push({
        startDate: nextClosureStartTime,
        endDate: nextClosureEndTime,
      });
      nextClosureStartTime = addMinutes(
        nextClosureEndTime,
        intervalBetweenClosures,
      );
    }

    return {
      timeframes: closureTimeframes,
    };
  },
};

function addMinutes(date: Date, minutes: number): Date {
  const target = new Date(date);
  target.setMinutes(target.getMinutes() + minutes);
  return target;
}
