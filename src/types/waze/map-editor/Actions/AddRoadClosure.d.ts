/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from './Action';

export class AddRoadClosure<P = any> extends Action<P> {
  closure: any;
}
