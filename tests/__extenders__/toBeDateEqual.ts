import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';
import { compareDates, formatDate } from '../utils';

function isDate(value: unknown): value is Date {
  return (
    value instanceof Date ||
    Object.prototype.toString.call(value) === '[object Date]'
  );
}

type CompareDatesOptions = Parameters<typeof compareDates>[2];

const toBeDateEqual: MatcherFunction<
  [expected: Date, options: CompareDatesOptions]
> = function (actual, expected, options) {
  if (!isDate(actual) || !isDate(expected)) {
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
