import { ignoreErrors } from './ignore-errors';

function errorThrowingFunction(): number {
  throw new Error('Error is thrown');
}

function resolvingFunction<T>(result: T): T {
  return result;
}

describe('utils/ignoreErrors', () => {
  it('should ignore thrown errors', () => {
    expect(() => errorThrowingFunction()).toThrow();
    expect(() => ignoreErrors(errorThrowingFunction)).not.toThrow();
    expect(ignoreErrors(errorThrowingFunction)).toBe(undefined);
  });

  it('should resolve to default value', () => {
    expect(() => errorThrowingFunction()).toThrow();
    expect(() => ignoreErrors(errorThrowingFunction, Infinity)).not.toThrow();
    expect(ignoreErrors(errorThrowingFunction, Infinity)).toBe(Infinity);
  });

  it('should resolve to actual return value', () => {
    const testee = () => resolvingFunction(5);
    expect(() => testee()).not.toThrow();
    expect(() => ignoreErrors(testee, Infinity)).not.toThrow();
    expect(ignoreErrors(testee, Infinity)).toBe(testee());
  });
});
