import { Timeframe } from 'interfaces';
import { RecurringMode } from '../recurring-mode';
import { DailyConfigForm, DailyConfigFormFields } from './DailyConfigForm';

export const DailyRecurringMode: RecurringMode<DailyConfigFormFields> = {
  id: 'DAILY',
  name: 'Daily',
  formComponent: DailyConfigForm,
  calculateClosureTimes: ({ fieldsValues, timeframe }) => {
    const dailyTimeframes = getDailyTimeframes(timeframe);

    // return filtered timeframes based on the day of week of start day
    return {
      timeframes: dailyTimeframes.filter((dailyTimeframe) => {
        const startDayOfWeek = dailyTimeframe.startDate.getDay();
        return fieldsValues.days.includes(startDayOfWeek);
      }),
    };
  },
};

function getDailyTimeframes(timeframe: Timeframe): Timeframe[] {
  const results: Timeframe[] = [];

  // Ensure endDate is strictly after startDate
  if (timeframe.endDate <= timeframe.startDate) {
    // Allow zero-duration if needed, otherwise return empty
    console.warn('Warning: timeframe has zero or negative duration.');
    return results;
  }

  const overallStart = timeframe.startDate;
  const overallEnd = timeframe.endDate;
  const isOvernight = isOvernightTimeframe(timeframe);

  // Initialize loop date to the beginning of the overall start date's day
  const currentDayStart = new Date(overallStart);
  currentDayStart.setHours(0, 0, 0, 0);

  // --- Loop Through Days ---
  while (currentDayStart < overallEnd) {
    // Continue as long as the start of the current day is before the overall end time

    // Ideal start for this day is current day date + overallStart time
    const idealStart = new Date(currentDayStart);
    idealStart.setHours(
      overallStart.getHours(),
      overallStart.getMinutes(),
      overallStart.getSeconds(),
      overallStart.getMilliseconds(),
    );

    // Ideal end for this day is *next* day date + overallEnd time
    const idealEnd = new Date(currentDayStart); // Start with current day
    idealEnd.setHours(
      overallEnd.getHours(),
      overallEnd.getMinutes(),
      overallEnd.getSeconds(),
      overallEnd.getMilliseconds(),
    );
    if (isOvernight) idealEnd.setDate(idealEnd.getDate() + 1); // Move date to next day

    const segmentStart = new Date(
      Math.max(idealStart.getTime(), overallStart.getTime()),
    );
    const segmentEnd = new Date(
      Math.min(idealEnd.getTime(), overallEnd.getTime()),
    );

    // Add the calculated segment only if it's valid (start < end)
    // This check handles cases where clamping might invert or zero the duration.
    if (segmentStart < segmentEnd) {
      results.push({ startDate: segmentStart, endDate: segmentEnd });
    }

    // Move to the next day for the next iteration
    currentDayStart.setDate(currentDayStart.getDate() + 1);
  }

  return results;
}

/**
 * Checks if a timeframe represents an "overnight" period, meaning
 * the time part of the end date is earlier than the time part of the start date.
 * Example: Starts at 10:00 PM, ends at 6:00 AM the next day.
 *
 * @param {object} timeframe An object with startDate and endDate properties.
 * @param {Date} timeframe.startDate The start date and time.
 * @param {Date} timeframe.endDate The end date and time.
 * @returns {boolean} True if the end time is earlier in the day than the start time, false otherwise.
 */
function isOvernightTimeframe(timeframe: Timeframe): boolean {
  // Optional: Add input validation
  if (
    !timeframe ||
    !(timeframe.startDate instanceof Date) ||
    !(timeframe.endDate instanceof Date)
  ) {
    // Or throw an error, depending on desired behavior
    console.error(
      'Invalid input: timeframe object with startDate and endDate (Date objects) required.',
    );
    return false;
  }

  const start = timeframe.startDate;
  const end = timeframe.endDate;

  // Calculate milliseconds past midnight for start time (local time)
  const startMillisSinceMidnight =
    start.getHours() * 3600000 +
    start.getMinutes() * 60000 +
    start.getSeconds() * 1000 +
    start.getMilliseconds();

  // Calculate milliseconds past midnight for end time (local time)
  const endMillisSinceMidnight =
    end.getHours() * 3600000 +
    end.getMinutes() * 60000 +
    end.getSeconds() * 1000 +
    end.getMilliseconds();

  return endMillisSinceMidnight <= startMillisSinceMidnight;
}
