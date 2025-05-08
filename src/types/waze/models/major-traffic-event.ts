import { Model } from 'backbone';
import { MajorTrafficEventCategory } from '../enums/major-traffic-event-category';
import { Polygon } from 'geojson';
import { UserRank } from '../user-rank';

interface LocalizedString {
  locale: string;
  value: string;
}

export type MajorTrafficEvent = Model<{
  active: boolean;
  category: MajorTrafficEventCategory;
  cityID: number | null;
  createdBy: number | null;
  createdOn: EpochTimeStamp | null;
  descriptions: LocalizedString[];
  duplicateClosuresFromOriginal: unknown | null;
  endDate: string;
  geoJSONGeometry: Polygon | null;
  id: string;
  lockRank: UserRank | null;
  names: LocalizedString[];
  originalMajorTrafficEventId: string | null;
  permissions: number;
  published: boolean;
  pushScheduled: boolean;
  rank: UserRank;
  ready: boolean;
  startDate: string;
  uniqueName: string;
  updatedBy: number | null;
  updatedOn: EpochTimeStamp | null;
  url: string | null;
}>;
