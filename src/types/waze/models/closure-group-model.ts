import { Model } from 'backbone';
import { ClosureAttribution } from '../interfaces/closure-attribution';
import { WazeDirection } from 'enums';

export type ClosureGroupModel = Model<{
  attribution: ClosureAttribution[];
  closures: Model[];
  closureType: 'roadClosure' | 'turnClosure';
  createdBy: number | null;
  direction: WazeDirection;
  endDate: string;
  eventId: string | null | undefined;
  externalProvider: unknown | null;
  externalProviderId: unknown | null;
  fromSegForward: boolean;
  fromSegID: number | undefined;
  partial: boolean;
  permanent: boolean;
  provider: null | string;
  reason: string;
  reverseSegments: object;
  segments: Model[];
  startDate: string;
  toSegForward: boolean;
  toSegID: number | undefined;
}> & {
  isNewOne(): boolean;
};
