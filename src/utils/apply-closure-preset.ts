import { ClosureEditorForm, DateOnly } from 'classes';
import { TimeOnly } from 'classes/time-only';
import { getDateResolverByName } from 'consts/date-resolvers';
import { ClosurePreset } from 'interfaces/closure-preset';

function getStartDateForPreset(
  closureDetails: ClosurePreset['closureDetails'],
  defaultStartDate: DateOnly = new DateOnly(),
): Date {
  const date =
    closureDetails.startDate ?
      getDateResolverByName(closureDetails.startDate.type).resolve(
        closureDetails.startDate.args,
      )
    : defaultStartDate;

  const time =
    closureDetails.startTime ?
      new TimeOnly(
        closureDetails.startTime.hours,
        closureDetails.startTime.minutes,
        0,
        0,
      )
    : new TimeOnly();

  return date.withTime(time);
}

function getEndDateForPreset(
  closureDetails: ClosurePreset['closureDetails'],
  startDate: Date,
): Date {
  const { end: endDetails } = closureDetails;

  switch (endDetails.type) {
    case 'DURATIONAL':
      return new Date(
        startDate.getTime() +
          (endDetails.duration.hours * 3600 +
            endDetails.duration.minutes * 60) *
            1000,
      );
    case 'FIXED': {
      const startTime = new TimeOnly(startDate);
      const endTime = new TimeOnly(
        endDetails.time.hours,
        endDetails.time.minutes,
        0,
        0,
      );
      const endDate = new Date(startDate);
      endDate.setHours(
        endTime.getHours(),
        endTime.getMinutes(),
        endTime.getSeconds(),
        endTime.getMilliseconds(),
      );
      if (endTime < startTime) {
        // we need to apply the end time to the next day
        endDate.setDate(endDate.getDate() + 1);
      }
      return endDate;
    }
  }
}

export function applyClosurePreset(
  { closureDetails }: ClosurePreset,
  closureEditorForm: ClosureEditorForm,
) {
  const startDate = getStartDateForPreset(
    closureDetails,
    new DateOnly(closureEditorForm.getStart()),
  );
  const endDate = getEndDateForPreset(closureDetails, startDate);

  if (closureDetails.description)
    closureEditorForm.setDescription(closureDetails.description);

  closureEditorForm.setStart(startDate);
  closureEditorForm.setEnd(endDate);
}
