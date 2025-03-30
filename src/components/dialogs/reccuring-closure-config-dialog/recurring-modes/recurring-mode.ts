import { Timeframe } from 'interfaces';
import { ComponentType, Ref } from 'react';

export interface RecurringModeFormProps {
  fieldsValuesRef: Ref<Record<string, string | number>>;
}

export interface CalculateClosureTimesRequest {
  timeframe: Timeframe;
  fieldsValues: Record<string, string | number>;
}

export interface CalculateClosureTimesResponse {
  timeframes: Timeframe[];
}

export interface RecurringMode {
  id: string;
  name: string;
  disabledReason?: string | null;
  formComponent?: ComponentType<RecurringModeFormProps>;
  calculateClosureTimes(
    request: CalculateClosureTimesRequest,
  ): CalculateClosureTimesResponse | Promise<CalculateClosureTimesResponse>;
}
