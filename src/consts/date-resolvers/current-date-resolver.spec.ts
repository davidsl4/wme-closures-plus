import {expect} from '@jest/globals';
import '../../../tests/__extenders__/toBeDateEqual';
import { CURRENT_DATE_RESOLVER } from './current-date-resolver';

describe('CurrentDateResolver', () => {
  it('should be defined', () => {
    expect(CURRENT_DATE_RESOLVER).toBeDefined();
  });

  it('should have the correct name', () => {
    expect(CURRENT_DATE_RESOLVER.name).toBe('CURRENT_DATE');
  });

  it('should return the current date', () => {
    function expectWithDate(date: Date) {
      // mock the Date constructor to return a specific date
      const mock = jest.spyOn(global, 'Date').mockImplementation(() => date);
      expect(CURRENT_DATE_RESOLVER.resolve({})).toBeDateEqual(date);
      mock.mockRestore();
    }

    expectWithDate(new Date());
    expectWithDate(new Date('2023-10-01T00:00:00Z'));
    expectWithDate(new Date('2023-10-02T12:34:56Z'));
    expectWithDate(new Date('2023-10-03T23:59:59Z'));
    expectWithDate(new Date('2023-10-04T00:00:00Z'));
    expectWithDate(new Date('2020-10-05T12:34:56Z'));
    expectWithDate(new Date('2021-10-06T23:59:59Z'));
    expectWithDate(new Date('2028-04-07T00:00:00Z'));
    expectWithDate(new Date('2029-05-08T12:34:56Z'));
  })
});