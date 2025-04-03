/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogLayoutButtonProps } from 'components/dialogs/dialog-outlet';
import { ModalDialogButtons } from 'components/dialogs/dialog-outlet/types';
import { Timeframe } from 'interfaces';
import { ComponentType, Ref } from 'react';

export interface RecurringModeFormProps<
  F extends Record<string, any> = Record<string, any>,
> extends DialogLayoutButtonProps<ModalDialogButtons> {
  fieldsValuesRef: Ref<F>;
  initialFieldValues?: F;
}

export interface CalculateClosureTimesRequest<
  F extends Record<string, any> = Record<string, any>,
> {
  timeframe: Timeframe;
  fieldsValues: F;
}

export interface CalculateClosureTimesResponse {
  timeframes: Timeframe[];
}

export interface RecurringMode<
  F extends Record<string, any> = Record<string, any>,
> {
  id: string;
  name: string;
  disabledReason?: string | null;
  formComponent?: ComponentType<RecurringModeFormProps<F>>;
  calculateClosureTimes(
    request: CalculateClosureTimesRequest<F>,
  ): CalculateClosureTimesResponse | Promise<CalculateClosureTimesResponse>;
}
