import { Timeframe } from 'interfaces';
import {
  CalculateClosureTimesResponse,
  RecurringMode,
} from '../recurring-modes';

export interface SelectedRecurringMode
  extends Pick<RecurringMode, 'id' | 'name'> {
  fields: Record<string, string | number>;
  calculateClosureTimes(timeframe: Timeframe): CalculateClosureTimesResponse;
}
