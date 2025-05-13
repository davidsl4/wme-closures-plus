interface FormatDateOptions {
  resolution?: 'day' | 'hour' | 'minute' | 'second';
}
export function formatDate(
  date: Date,
  options: FormatDateOptions = {},
): string {
  const { resolution = 'day' } = options;
  const dateCopy = new Date(date);

  switch (resolution) {
    case 'day':
      return dateCopy.toISOString().split('T')[0];
    case 'hour':
      dateCopy.setMinutes(0, 0, 0);
      return (
        dateCopy.toISOString().split('T')[0] +
        'T' +
        dateCopy.toISOString().split('T')[1].slice(0, 2) +
        ':00Z'
      );
    case 'minute':
      dateCopy.setSeconds(0, 0);
      return (
        dateCopy.toISOString().split('T')[0] +
        'T' +
        dateCopy.toISOString().split('T')[1].slice(0, 5) +
        'Z'
      );
    case 'second':
      dateCopy.setMilliseconds(0);
      return (
        dateCopy.toISOString().split('T')[0] +
        'T' +
        dateCopy.toISOString().split('T')[1].slice(0, 8) +
        'Z'
      );
    default:
      throw new Error(`Invalid resolution: ${resolution}`);
  }
}
