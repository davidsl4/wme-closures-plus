import { TimeOnly } from './time-only';

type DateOnlyPropertyKeys =
  | 'toString'
  | 'toISOString'
  | 'toJSON'
  | 'getUTCDate'
  | 'getUTCMonth'
  | 'getUTCFullYear'
  | 'getUTCDay'
  | 'getDate'
  | 'getMonth'
  | 'getFullYear'
  | 'getDay'
  | 'setUTCDate'
  | 'setUTCMonth'
  | 'setUTCFullYear'
  | 'setDate'
  | 'setMonth'
  | 'setFullYear';

export class DateOnly implements Pick<Date, DateOnlyPropertyKeys> {
  private date: Date;

  /**
   * Creates a new DateOnly instance with the current date.
   */
  constructor();

  /**
   * Creates a new DateOnly instance with the specified date.
   * @param date - The date to set.
   */
  constructor(date: Date);

  /**
   * Creates a new DateOnly instance with the specified milliseconds.
   * @param millis - The number of milliseconds since the Unix epoch.
   */
  constructor(millis: number);

  /**
   * Creates a new DateOnly instance with the specified date string.
   * @param dateString - The date string to parse.
   */
  constructor(dateString: string);

  /**
   * Creates a new DateOnly instance with the specified day, month, and year.
   * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
   * @param monthIndex The month as a number between 0 and 11 (January to December).
   * @param date The date as a number between 1 and 31.
   */
  constructor(year: number, monthIndex: number, date: number);

  constructor(
    valueOrYear?: Date | number | string,
    monthIndex?: number,
    date?: number,
  ) {
    if (arguments.length === 0) this.date = new Date();
    else if (arguments.length === 3)
      this.date = new Date(
        Date.UTC(valueOrYear as number, monthIndex as number, date as number),
      );
    else this.date = new Date(valueOrYear);

    this.date.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
  }

  toString(): string {
    return this.date.toDateString();
  }

  toISOString(): string {
    return this.date.toISOString().split('T')[0]; // Return only the date part
  }

  toJSON(): string {
    return this.toISOString();
  }

  /**
   * Returns the date as a Date object.
   * @returns The date as a Date object.
   */
  toDate(): Date {
    return new Date(this.date);
  }

  /**
   * Returns the date as a number of milliseconds since the Unix epoch.
   * @returns The date as a number of milliseconds.
   */
  getTime(): number {
    return this.date.getTime();
  }

  getUTCDate(): number {
    return this.date.getUTCDate();
  }

  getUTCMonth(): number {
    return this.date.getUTCMonth();
  }

  getUTCFullYear(): number {
    return this.date.getUTCFullYear();
  }

  getUTCDay(): number {
    return this.date.getUTCDay();
  }

  getDate(): number {
    return this.date.getDate();
  }

  getMonth(): number {
    return this.date.getMonth();
  }

  getFullYear(): number {
    return this.date.getFullYear();
  }

  getDay(): number {
    return this.date.getDay();
  }

  setUTCDate(date: number): number {
    this.date.setUTCDate(date);
    return this.getTime();
  }

  setUTCMonth(month: number): number {
    this.date.setUTCMonth(month);
    return this.getTime();
  }

  setUTCFullYear(year: number): number {
    this.date.setUTCFullYear(year);
    return this.getTime();
  }

  setDate(date: number): number {
    this.date.setDate(date);
    return this.getTime();
  }

  setMonth(month: number): number {
    this.date.setMonth(month);
    return this.getTime();
  }

  setFullYear(year: number): number {
    this.date.setFullYear(year);
    return this.getTime();
  }

  withTime(time: TimeOnly): Date {
    const date = this.toDate();
    date.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    );
    return date;
  }

  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string | number {
    switch (hint) {
      case 'number':
        return this.getTime();
      case 'string':
      default:
        return this.toString();
    }
  }
}
