/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatDate } from './format-date';

describe('formatDate', () => {
  it('should format the date with default resolution (day)', () => {
    expect(formatDate(new Date('2023-10-15T14:20:30Z'))).toBe('2023-10-15');
    expect(formatDate(new Date('2000-01-01T00:00:00Z'))).toBe('2000-01-01');
    expect(formatDate(new Date('1999-12-31T23:59:59Z'))).toBe('1999-12-31');
  });

  it('should format the date to hour resolution', () => {
    expect(
      formatDate(new Date('2023-10-15T14:20:30Z'), { resolution: 'hour' }),
    ).toBe('2023-10-15T14:00Z');
    expect(
      formatDate(new Date('2000-01-01T00:45:00Z'), { resolution: 'hour' }),
    ).toBe('2000-01-01T00:00Z');
    expect(
      formatDate(new Date('1999-12-31T23:59:59Z'), { resolution: 'hour' }),
    ).toBe('1999-12-31T23:00Z');
  });

  it('should format the date to minute resolution', () => {
    expect(
      formatDate(new Date('2023-10-15T14:20:30Z'), { resolution: 'minute' }),
    ).toBe('2023-10-15T14:20Z');
    expect(
      formatDate(new Date('2000-01-01T00:45:59Z'), { resolution: 'minute' }),
    ).toBe('2000-01-01T00:45Z');
    expect(
      formatDate(new Date('1999-12-31T23:59:59Z'), { resolution: 'minute' }),
    ).toBe('1999-12-31T23:59Z');
  });

  it('should format the date to second resolution', () => {
    expect(
      formatDate(new Date('2023-10-15T14:20:30.123Z'), {
        resolution: 'second',
      }),
    ).toBe('2023-10-15T14:20:30Z');
    expect(
      formatDate(new Date('2000-01-01T00:45:59.999Z'), {
        resolution: 'second',
      }),
    ).toBe('2000-01-01T00:45:59Z');
    expect(
      formatDate(new Date('1999-12-31T23:59:59.123Z'), {
        resolution: 'second',
      }),
    ).toBe('1999-12-31T23:59:59Z');
  });

  it('should throw an error for invalid resolution', () => {
    expect(() =>
      formatDate(new Date('2023-10-15T14:20:30Z'), {
        resolution: 'invalid' as any,
      }),
    ).toThrow('Invalid resolution: invalid');
    expect(() =>
      formatDate(new Date('2000-01-01T00:00:00Z'), {
        resolution: 'invalid' as any,
      }),
    ).toThrow('Invalid resolution: invalid');
  });

  it('should throw an error for invalid dates', () => {
    expect(() => formatDate(new Date('invalid-date-string'))).toThrow();
    expect(() => formatDate(new Date(NaN))).toThrow();
    expect(() => formatDate(new Date(''))).toThrow();
    expect(() => formatDate(new Date(undefined as any))).toThrow();
  });

  it('should work without a resolution specified', () => {
    expect(formatDate(new Date('2023-10-15T14:20:30Z'))).toBe('2023-10-15');
    expect(formatDate(new Date('2000-01-01T00:00:00Z'))).toBe('2000-01-01');
    expect(formatDate(new Date('1999-12-31T23:59:59Z'))).toBe('1999-12-31');
  });
});
