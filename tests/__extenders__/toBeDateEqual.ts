import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';
import { compareDates } from '../utils/compare-dates';

function isDate(value: unknown): value is Date {
  return (
    value instanceof Date ||
    Object.prototype.toString.call(value) === '[object Date]'
  );
}

type CompareDatesOptions = Parameters<typeof compareDates>[2];

function formatDate(date: Date, options: CompareDatesOptions = {}): string {
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
        ':00Z'
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

const toBeDateEqual: MatcherFunction<
  [expected: Date, options: CompareDatesOptions]
> = function (actual, expected, options) {
  if (!isDate(actual) || !isDate(expected)) {
    console.log(actual instanceof Date, expected instanceof Date);
    throw new TypeError('Both actual and expected values must be Date objects');
  }

  const pass = compareDates(actual, expected, options);

  if (pass) {
    return {
      message: () =>
        `expected ${formatDate(actual)} not to be equal to ${formatDate(expected)}`,
      pass: true,
    };
  }

  return {
    message: () =>
      `expected ${formatDate(actual)} to be equal to ${formatDate(expected)}`,
    pass: false,
  };
};

expect.extend({
  toBeDateEqual,
});

declare module 'expect' {
  interface Matchers<R> {
    toBeDateEqual(expected: Date, options?: CompareDatesOptions): R;
  }
}
