import { RecurringMode } from '../recurring-mode';
import { DailyConfigForm } from './DailyConfigForm';

export const DailyRecurringMode: RecurringMode = {
  id: 'DAILY',
  name: 'Daily',
  // disabledReason: 'Daily configuration is still in development',
  formComponent: DailyConfigForm,
  calculateClosureTimes: () => {
    throw new Error('Not implemented');
  },
};
