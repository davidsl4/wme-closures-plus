import { MajorTrafficEvent, MajorTrafficEventCategory } from 'types/waze';
import {
  MajorTrafficEventCategory as SdkMajorTrafficEventCategory,
  MajorTrafficEvent as SdkMajorTrafficEvent,
} from 'wme-sdk-typings';
import { getModificationMetadata } from './get-modification-data';

const CategoryToSdkCategory: Record<
  MajorTrafficEventCategory,
  SdkMajorTrafficEventCategory
> = {
  [MajorTrafficEventCategory.Concert]: 'CONCERT',
  [MajorTrafficEventCategory.Construction]: 'CONSTRUCTION',
  [MajorTrafficEventCategory.Crisis]: 'CRISIS',
  [MajorTrafficEventCategory.Demonstration]: 'DEMONSTRATION',
  [MajorTrafficEventCategory.HolidayFestival]: 'HOLIDAY/FESTIVAL',
  [MajorTrafficEventCategory.Other]: 'OTHER',
  [MajorTrafficEventCategory.Parade]: 'PARADE',
  [MajorTrafficEventCategory.PartnerUserComms]: 'PARTNER_USER_COMMS',
  [MajorTrafficEventCategory.SportingEvent]: 'SPORTING_EVENT',
  [MajorTrafficEventCategory.Summit]: 'SUMMIT',
};

export function transformMajorTrafficEventToSdk(
  majorTrafficEvent: MajorTrafficEvent,
): SdkMajorTrafficEvent {
  const category = majorTrafficEvent.get('category');

  return {
    category: (category && CategoryToSdkCategory[category]) || null,
    cityId: majorTrafficEvent.get('cityID'),
    endDate: majorTrafficEvent.get('endDate'),
    id: majorTrafficEvent.get('id'),
    isPublished: majorTrafficEvent.get('published'),
    isReady: majorTrafficEvent.get('ready'),
    lockRank:
      majorTrafficEvent.get('lockRank') ?? majorTrafficEvent.get('rank'),
    modificationData: getModificationMetadata(majorTrafficEvent),
    names: majorTrafficEvent.get('names'),
    startDate: majorTrafficEvent.get('startDate'),
  };
}
