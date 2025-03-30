import {
  createElement,
  createRef,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import { WzTabs } from '../../WzTabs';
import { WzTab } from '../../WzTab';
import { DialogLayoutProps } from '../dialog-outlet';
import {
  CalculateClosureTimesResponse,
  RecurringMode,
} from './recurring-modes';
import { allRecurringModes } from './recurring-modes';
import { Timeframe } from 'interfaces';

interface ReccuringClosureConfigDialogResult {
  readonly recurringMode: Pick<RecurringMode, 'id' | 'name'> & {
    calculateClosureTimes(
      timeframe: Timeframe,
    ): CalculateClosureTimesResponse | Promise<CalculateClosureTimesResponse>;
  };
}

interface RecurringClosureConfigDialogProps
  extends DialogLayoutProps<ReccuringClosureConfigDialogResult> {
  recurringModes?: RecurringMode[];
}

type FieldsValuesMap = Record<string, string | number>;
type FieldsValuesRef = RefObject<FieldsValuesMap>;

export function ReccuringClosureConfigDialog({
  recurringModes = allRecurringModes,
  ...props
}: RecurringClosureConfigDialogProps) {
  const modeSelectionTabsRef = useRef<WzTabs>(null);
  const fieldsValuesRef = useRef<Record<string, FieldsValuesRef>>({});
  const activeModeId = useRef<string>(null);

  useImperativeHandle(
    props.stateRef,
    () =>
      ({
        get recurringMode() {
          const mode = recurringModes.find(
            (mode) => mode.id === activeModeId.current,
          );
          if (!mode) return null;

          return {
            ...mode,
            id: activeModeId.current,
            fields: fieldsValuesRef.current[activeModeId.current].current,
            calculateClosureTimes: (timeframe: Timeframe) => {
              return mode.calculateClosureTimes({
                timeframe,
                fieldsValues:
                  fieldsValuesRef.current[activeModeId.current].current,
              });
            },
          };
        },
      }) as const,
    [recurringModes],
  );

  const handleTabActive = () => {
    const { activeTabId } = modeSelectionTabsRef.current;
    if (recurringModes.some((mode) => mode.id === activeTabId))
      activeModeId.current = activeTabId;
    else activeModeId.current = null;
  };

  return (
    <>
      <wz-body2>
        Define how this closure should repeat within the selected dates and
        times
      </wz-body2>

      <WzTabs
        ref={modeSelectionTabsRef}
        fixed
        style={{ marginTop: 8 }}
        onTabActive={handleTabActive}
      >
        {recurringModes.map((recurringMode) => {
          const fieldsValuesMap =
            fieldsValuesRef.current[recurringMode.id] || createRef();

          fieldsValuesRef.current[recurringMode.id] = fieldsValuesMap;
          return (
            <WzTab
              key={recurringMode.id}
              id={recurringMode.id}
              label={recurringMode.name}
              disabled={!!recurringMode.disabledReason}
              tooltip={recurringMode.disabledReason}
            >
              {recurringMode.formComponent &&
                createElement(recurringMode.formComponent, {
                  fieldsValuesRef: (instance) => {
                    if (!instance) return;
                    fieldsValuesRef.current[recurringMode.id].current =
                      instance;
                  },
                })}
            </WzTab>
          );
        })}
      </WzTabs>
    </>
  );
}
