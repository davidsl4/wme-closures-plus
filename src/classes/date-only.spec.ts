import { DateOnly } from './date-only';

const FIXED_DATE = new Date('2023-01-01T18:41:00Z');

describe('DateOnly', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE); // Set a fixed date for testing
  });

  it('should create an instance with the current date when no arguments are provided', () => {
    const dateOnly = new DateOnly();
    const now = new Date();
    expect(dateOnly.getUTCDate()).toBe(now.getUTCDate());
    expect(dateOnly.getUTCMonth()).toBe(now.getUTCMonth());
    expect(dateOnly.getUTCFullYear()).toBe(now.getUTCFullYear());
    expect(dateOnly.getUTCDay()).toBe(now.getUTCDay());
    expect(dateOnly.toISOString()).toBe(now.toISOString().split('T')[0]);
  });

  it('should create an instance with a specific Date object', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const dateOnly = new DateOnly(date);
    expect(dateOnly.getUTCDate()).toBe(date.getUTCDate());
    expect(dateOnly.getUTCMonth()).toBe(date.getUTCMonth());
    expect(dateOnly.getUTCFullYear()).toBe(date.getUTCFullYear());
    expect(dateOnly.getUTCDay()).toBe(date.getUTCDay());
    expect(dateOnly.toISOString()).toBe('2023-01-01');
  });

  it('should create an instance with a specific timestamp', () => {
    const timestamp = Date.UTC(2023, 0, 1);
    const dateOnly = new DateOnly(timestamp);
    expect(dateOnly.getUTCDate()).toBe(1);
    expect(dateOnly.getUTCMonth()).toBe(0);
    expect(dateOnly.getUTCFullYear()).toBe(2023);
    expect(dateOnly.getUTCDay()).toBe(0);
    expect(dateOnly.toISOString()).toBe('2023-01-01');
  });

  it('should create an instance with a specific date string', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.toISOString()).toBe('2023-01-01');
  });

  it('should create an instance with year, month, and date', () => {
    const dateOnly = new DateOnly(2023, 0, 1);
    expect(dateOnly.toISOString()).toBe('2023-01-01');
  });

  it('should return the correct string representation', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.toString()).toBe('Sun Jan 01 2023');
  });

  it('should return the correct ISO string', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.toISOString()).toBe('2023-01-01');
  });

  it('should return the correct JSON representation', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.toJSON()).toBe('2023-01-01');
  });

  it('should return the correct UTC date components', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.getUTCDate()).toBe(1);
    expect(dateOnly.getUTCMonth()).toBe(0);
    expect(dateOnly.getUTCFullYear()).toBe(2023);
    expect(dateOnly.getUTCDay()).toBe(0);
  });

  it('should return the correct local date components', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.getDate()).toBe(1);
    expect(dateOnly.getMonth()).toBe(0);
    expect(dateOnly.getFullYear()).toBe(2023);
    expect(dateOnly.getDay()).toBe(0);
  });

  it('should set and return the correct UTC date components', () => {
    const dateOnly = new DateOnly('2023-01-01');
    dateOnly.setUTCDate(2);
    expect(dateOnly.getUTCDate()).toBe(2);

    dateOnly.setUTCMonth(1);
    expect(dateOnly.getUTCMonth()).toBe(1);

    dateOnly.setUTCFullYear(2024);
    expect(dateOnly.getUTCFullYear()).toBe(2024);
  });

  it('should set and return the correct local date components', () => {
    const dateOnly = new DateOnly('2023-01-01');
    dateOnly.setDate(2);
    expect(dateOnly.getDate()).toBe(2);

    dateOnly.setMonth(1);
    expect(dateOnly.getMonth()).toBe(1);

    dateOnly.setFullYear(2024);
    expect(dateOnly.getFullYear()).toBe(2024);
  });

  it('should return the correct time in milliseconds since the Unix epoch', () => {
    const dateOnly = new DateOnly('2023-01-01');
    expect(dateOnly.getTime()).toBe(Date.UTC(2023, 0, 1));
  });

  it('should return a new Date object with the correct value', () => {
    const dateOnly = new DateOnly('2023-01-01');
    const date = dateOnly.toDate();
    expect(date.getTime()).toBe(Date.UTC(2023, 0, 1));
  });

  it('should compare two DateOnly instances correctly', () => {
    const date1 = new DateOnly('2023-01-01');
    const date2 = new DateOnly('2023-01-01');
    const date3 = new DateOnly('2023-01-02');
    const date4 = new DateOnly(Date.now());

    expect(date1.getTime()).toBe(date2.getTime());
    expect(date1.getTime()).not.toBe(date3.getTime());
    expect(date1.getTime()).toBe(date4.getTime());
  });
});
