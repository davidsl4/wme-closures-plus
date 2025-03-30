import { RecurringMode } from './recurring-mode';

export const DailyRecurringMode: RecurringMode = {
  id: 'DAILY',
  name: 'Daily',
  disabledReason: 'Daily configuration is still in development',
  calculateClosureTimes: () => {
    throw new Error('Not implemented');
  },
};
