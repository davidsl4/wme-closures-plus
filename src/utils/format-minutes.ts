export function formatMinutes(minutes: number): string {
  if (typeof minutes !== 'number' || minutes < 0) return null;

  const days = Math.floor(minutes / 1440);
  const remainingMinutesAfterDays = minutes % 1440;
  const hours = Math.floor(remainingMinutesAfterDays / 60);
  const remainingMinutes = remainingMinutesAfterDays % 60;

  let result = '';

  if (days > 0) {
    result += `${days} day${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    if (result) {
      result += ` and `;
    }
    result += `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (remainingMinutes > 0) {
    if (result) {
      result += ` and `;
    }
    result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }

  return result || '0 minutes';
}
