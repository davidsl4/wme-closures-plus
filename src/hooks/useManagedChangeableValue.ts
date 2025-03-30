import {
  ChangeEvent,
  ChangeEventHandler,
  InputHTMLAttributes,
  useReducer,
} from 'react';

type ValueType = InputHTMLAttributes<HTMLInputElement>['value'];

interface ChangeableValueProps {
  value?: ValueType;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function useManagedChangeableValue(
  props: ChangeableValueProps,
): ChangeableValueProps {
  const [uncontrolledValue, dispatchUncontrolledChange] = useValueReducer('');
  const { value: controlledValue, onChange: dispatchControlledChange } = props;

  if (controlledValue !== undefined && dispatchControlledChange !== undefined)
    return { value: controlledValue, onChange: dispatchControlledChange };

  return {
    value: uncontrolledValue,
    onChange: dispatchUncontrolledChange,
  };
}

function useValueReducer(initialState: ValueType) {
  const [state, dispatch] = useReducer<
    ValueType,
    [ChangeEvent<HTMLInputElement>]
  >((_prevValue, changeEvent) => {
    return changeEvent.target.value;
  }, initialState);

  return [state, dispatch] as const;
}
