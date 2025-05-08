interface DateComparisonOptions {
  resolution?: 'day' | 'hour' | 'minute' | 'second';
}

export function compareDates(
  date1: Date,
  date2: Date,
  { resolution = 'day' }: DateComparisonOptions = {},
): boolean {
  const date1Copy = new Date(date1);
  const date2Copy = new Date(date2);

  switch (resolution) {
    case 'day':
      date1Copy.setHours(0, 0, 0, 0);
      date2Copy.setHours(0, 0, 0, 0);
      break;
    case 'hour':
      date1Copy.setMinutes(0, 0, 0);
      date2Copy.setMinutes(0, 0, 0);
      break;
    case 'minute':
      date1Copy.setSeconds(0, 0);
      date2Copy.setSeconds(0, 0);
      break;
    case 'second':
      date1Copy.setMilliseconds(0);
      date2Copy.setMilliseconds(0);
      break;
    default:
      throw new Error(`Invalid resolution: ${resolution}`);
  }

  return date1Copy.getTime() === date2Copy.getTime();
}
