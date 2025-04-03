/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultiAddRoadClosure } from 'types/waze/map-editor/Actions';

export interface ClosureActionBuilder extends Record<string, any> {
  _addRoadClosures(
    closureGroupModel: any,
    loggedInUser: any,
  ): MultiAddRoadClosure;
  _getNewClosureID(): number | string;
}
