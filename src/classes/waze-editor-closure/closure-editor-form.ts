import { WazeDirection } from 'enums';
import { MajorTrafficEvent } from 'wme-sdk-typings';

export interface ClosureEditorForm {
  getDescription(): string;
  setDescription(description: string): void;

  getDirection(): WazeDirection;
  setDirection(direction: WazeDirection): void;

  getStart(): Date;
  setStart(start: Date): void;

  getEnd(): Date;
  setEnd(end: Date): void;

  getEventId(): string | null;
  setEventId(eventId: string | null): void;
  getAvailableEvents(): MajorTrafficEvent[];

  getIsPermanent(): boolean;
  setIsPermanent(permanent: boolean): void;

  canEditProvider(): boolean;
  getProvider(): string | null;
  setProvider(provider: string | null): void;
  getAvailableProviders(): string[];
}
