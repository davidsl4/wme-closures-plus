/* eslint-disable @typescript-eslint/no-explicit-any */

export class Action<P = any> {
  protected shouldSerialize: boolean;
  protected actionName: string;

  private _timestamp: number;
  public _description: string;
  private _actionId: number;

  constructor(props?: P);
  getID(): number;
  isLeaf(): boolean;
  accept(dataModel: any): void;
  doAction(dataModel: any): boolean;
  undoSupported(): boolean;
  undoAction(dataModel: any): void;
  redoAction(dataModel: any): void;
  flat(): Action<P>[];
  getBounds(): null;
  getAffectedUniqueIds(dataModel: any): string[];
  getFocusFeatures(dataModel: any): any[];
  getTimestamp(): number;
  generateDescription(dataModel: any): void;
  getDescription(): string;
  isSerializable(): boolean;
  getActionName(): string;
}
