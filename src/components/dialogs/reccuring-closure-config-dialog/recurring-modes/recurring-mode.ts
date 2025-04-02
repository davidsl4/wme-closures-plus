import { DialogLayoutButtonProps } from 'components/dialogs/dialog-outlet';
import { ModalDialogButtons } from 'components/dialogs/dialog-outlet/types';
import { Timeframe } from 'interfaces';
import { ComponentType, Ref } from 'react';

export interface RecurringModeFormProps
  extends DialogLayoutButtonProps<ModalDialogButtons> {
  fieldsValuesRef: Ref<Record<string, string | number>>;
  initialFieldValues?: Record<string, string | number>;
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
