import { SerializedDateResolver } from 'consts/date-resolvers';

interface ClosureFixedEnd {
  type: 'FIXED';
  time: {
    hours: number;
    minutes: number;
  };
}
interface ClosureDurationalEnd {
  type: 'DURATIONAL';
  duration: {
    hours: number;
    minutes: number;
  };
}

export interface ClosurePreset {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  closureDetails: {
    description?: string;
    startDate: SerializedDateResolver;
    startTime?: {
      hours: number;
      minutes: number;
    };
    end: ClosureFixedEnd | ClosureDurationalEnd;
  }
}