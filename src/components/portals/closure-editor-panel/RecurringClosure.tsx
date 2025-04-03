import { DialogOutlet, ReccuringClosureConfigDialog } from 'components/dialogs';
import { DialogDismissedError } from 'components/dialogs/dialog-outlet';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchError } from 'utils';
import { createSafePortal } from 'utils/create-safe-portal';
import { css, cx } from '@emotion/css';
import { SelectedRecurringMode } from 'components/dialogs/reccuring-closure-config-dialog/interfaces';
import { useEventListener } from 'usehooks-ts';
import {
  interceptAfterInvocation,
  MethodInterceptor,
} from 'method-interceptor';
import { getWindow } from 'utils/window-utils';
import { ClosureActionBuilder } from 'types';
import { AddRoadClosure } from 'types/waze/map-editor/Actions/AddRoadClosure';

const formGroupClass = css({
  display: 'flex',

  '& > wz-checkbox': {
    flex: 1,
  },
});

export interface RecurringClosureProps {
  closureEditPanel: Element;
}
export function RecurringClosure({ closureEditPanel }: RecurringClosureProps) {
  const dialogOutletRef = useRef<DialogOutlet>(null);
  const recurringClosureFormGroup = useMemo(() => {
    const newFormGroup = document.createElement('div');
    newFormGroup.className = cx('form-group', formGroupClass);
    return newFormGroup;
  }, []);
  useEffect(() => {
    const endDateElement = closureEditPanel.querySelector(
      '.form-group.end-date-form-group',
    );
    endDateElement.after(recurringClosureFormGroup);

    return () => {
      recurringClosureFormGroup.remove();
    };
  }, [closureEditPanel, recurringClosureFormGroup]);

  const [isEnabled, setIsEnabled] = useState(false);
  const [config, setConfig] = useState<SelectedRecurringMode | null>(null);

  const showConfigDialog = async () => {
    const [dismissReason, result] = await catchError(
      dialogOutletRef.current.showDialog(
        ReccuringClosureConfigDialog,
        {
          initialMode: config?.id,
          initialFieldValues: config?.fields,
        },
        {
          dialogProps: {
            title: 'Set Closure Repetition',
          },
          disabledButtons: ['APPLY'],
        },
      ),
      [DialogDismissedError],
    );

    if (dismissReason) return;

    setIsEnabled(true);
    setConfig(result.getRecurringMode());
  };

  const handleCheckboxChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget;

    if (checkbox.checked) {
      if (!config) {
        event.preventDefault();
        showConfigDialog();
      }
    }

    if (!event.isDefaultPrevented()) {
      setIsEnabled(checkbox.checked);
    } else {
      checkbox.checked = !checkbox.checked;
    }
  };

  const handleButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    showConfigDialog();
  };

  const nativeSaveButton = useMemo(() => {
    return closureEditPanel.querySelector(
      'wz-button[type=submit]',
    ) as HTMLButtonElement | null;
  }, [closureEditPanel]);
  useSaveButtonInterceptor(nativeSaveButton, (closures) => {
    if (!config) return closures;
    return closures.flatMap((closure) => {
      const startDate = new Date(closure.startDate);
      const endDate = new Date(closure.endDate);
      const { timeframes: targetTimeframes } = config.calculateClosureTimes({
        startDate,
        endDate,
      });
      return targetTimeframes.map((timeframe) => {
        return {
          ...closure,
          startDate: stringifyDate(timeframe.startDate),
          endDate: stringifyDate(timeframe.endDate),
        };
      });
    });
  });

  return createSafePortal(
    <>
      <wz-checkbox
        checked={isEnabled && config}
        onChange={handleCheckboxChanged}
      >
        Reccuring Closure
      </wz-checkbox>

      <wz-button
        color="text"
        size="sm"
        disabled={!isEnabled || !config}
        onClick={handleButtonClick}
      >
        Change
      </wz-button>

      <DialogOutlet ref={dialogOutletRef} />
    </>,
    recurringClosureFormGroup,
  );
}

function useSaveButtonInterceptor(
  saveButtonElement: HTMLButtonElement | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modifyClosures: (roadClosuresAttributes: any[]) => any[],
) {
  useEventListener(
    'pointerdown',
    () => {
      const ww = getWindow<{
        require(
          module: 'Waze/Modules/Closures/Models/ClosureActionBuilder',
        ): ClosureActionBuilder;
      }>();
      const closureActionBuilder = ww.require(
        'Waze/Modules/Closures/Models/ClosureActionBuilder',
      );
      const interceptor = new MethodInterceptor(
        closureActionBuilder,
        '_addRoadClosures',
        interceptAfterInvocation((result, closureGroupModel, loggedInUser) => {
          console.log(
            'Intercepted _addRoadClosures',
            closureGroupModel,
            loggedInUser,
            result,
          );
          (() => {
            const addClosureActions =
              result.getSubActions() as AddRoadClosure[];
            if (!addClosureActions.length) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AddRoadClosure: any = addClosureActions[0].constructor;
            const RoadClosure = addClosureActions[0].closure.constructor;
            const closureAttributes = addClosureActions.map(
              (addClosureAction) => addClosureAction.closure.getAttributes(),
            );
            if (modifyClosures) {
              const modifiedClosures = modifyClosures(closureAttributes);
              result.subActions = modifiedClosures.map((closureAttributes) => {
                closureAttributes.id = closureActionBuilder._getNewClosureID();
                const roadClosure = new RoadClosure(closureAttributes);
                const segmentId = closureAttributes.segID;
                const segment =
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  getWindow<any>().W.model.segments.getObjectById(segmentId);
                return new AddRoadClosure(roadClosure, segment);
              });
            }
          })();
          interceptor.restore();
          return result;
        }),
      );
      interceptor.enable();
      setTimeout(() => {
        interceptor.restore();
      }, 1000);
    },
    { current: saveButtonElement },
  );
}

function stringifyDate(value: Date): string {
  const year = value.getFullYear().toString().padStart(2, '4');
  const month = (value.getMonth() + 1).toString().padStart(2, '0');
  const day = value.getDate().toString().padStart(2, '0');
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
