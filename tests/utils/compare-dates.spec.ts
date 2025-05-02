import { compareDates } from './compare-dates';

describe('compareDates', () => {
  it('should return true for the same dates at day resolution', () => {
    const date1 = new Date('2023-01-01T12:00:00');
    const date2 = new Date('2023-01-01T15:30:00');
    expect(compareDates(date1, date2, { resolution: 'day' })).toBe(true);
  });

  it('should return false for different dates at day resolution', () => {
    const date1 = new Date('2023-01-01T12:00:00');
    const date2 = new Date('2023-01-02T12:00:00');
    expect(compareDates(date1, date2, { resolution: 'day' })).toBe(false);
  });

  it('should return true for the same dates at hour resolution', () => {
    const date1 = new Date('2023-01-01T12:30:00');
    const date2 = new Date('2023-01-01T12:45:00');
    expect(compareDates(date1, date2, { resolution: 'hour' })).toBe(true);
  });

  it('should return false for different dates at hour resolution', () => {
    const date1 = new Date('2023-01-01T12:00:00');
    const date2 = new Date('2023-01-01T13:00:00');
    expect(compareDates(date1, date2, { resolution: 'hour' })).toBe(false);
  });

  it('should return true for the same dates at minute resolution', () => {
    const date1 = new Date('2023-01-01T12:30:15');
    const date2 = new Date('2023-01-01T12:30:45');
    expect(compareDates(date1, date2, { resolution: 'minute' })).toBe(true);
  });

  it('should return false for different dates at minute resolution', () => {
    const date1 = new Date('2023-01-01T12:30:00');
    const date2 = new Date('2023-01-01T12:31:00');
    expect(compareDates(date1, date2, { resolution: 'minute' })).toBe(false);
  });

  it('should return true for the same dates at second resolution', () => {
    const date1 = new Date('2023-01-01T12:30:15.123');
    const date2 = new Date('2023-01-01T12:30:15.999');
    expect(compareDates(date1, date2, { resolution: 'second' })).toBe(true);
  });

  it('should return false for different dates at second resolution', () => {
    const date1 = new Date('2023-01-01T12:30:15');
    const date2 = new Date('2023-01-01T12:30:16');
    expect(compareDates(date1, date2, { resolution: 'second' })).toBe(false);
  });

  it('should throw an error for an invalid resolution', () => {
    const date1 = new Date('2023-01-01T12:30:15');
    const date2 = new Date('2023-01-01T12:30:15');
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      compareDates(date1, date2, { resolution: 'invalid' as any }),
    ).toThrow('Invalid resolution: invalid');
  });
});
