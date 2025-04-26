import {expect} from '@jest/globals';
import '../../../tests/__extenders__/toBeDateEqual';
import { DAY_OF_WEEK_RESOLVER } from './day-of-week-resolver';
import { Weekday } from '../../enums';

describe('DAY_OF_WEEK_RESOLVER', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-04-17T13:00:00Z')); // Set a fixed date for testing
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve the next occurrence of the specified day of the week', () => {
    const result = DAY_OF_WEEK_RESOLVER.resolve({
      dayOfWeek: Weekday.Tuesday,
    });

    expect(result).toBeDateEqual(new Date('2025-04-22T13:00:00Z')); // Next Tuesday from the fixed date
    expect(result).toBeDateEqual(new Date('2025-04-22T05:00:00Z')); // Next Tuesday from the fixed date without time comparison
  });

  it('should return next week today\'s if the specified day of the week is today', () => {
    const result = DAY_OF_WEEK_RESOLVER.resolve({
      dayOfWeek: Weekday.Thursday,
    });

    expect(result).toBeDateEqual(new Date('2025-04-24T13:00:00Z')); // Next Thursday from the fixed date
    expect(result).toBeDateEqual(new Date('2025-04-24T05:00:00Z')); // Next Thursday from the fixed date without time comparison
  });

  it('should throw an error if the arguments are invalid', () => {
    expect(() => DAY_OF_WEEK_RESOLVER.resolve({ dayOfWeek: -1 as Weekday })).toThrow(
      'Invalid arguments for DAY_OF_WEEK_RESOLVER: dayOfWeek=-1'
    );

    expect(() => DAY_OF_WEEK_RESOLVER.resolve({ dayOfWeek: null as unknown as Weekday })).toThrow(
      'Invalid arguments for DAY_OF_WEEK_RESOLVER: dayOfWeek=null'
    );
  });
});