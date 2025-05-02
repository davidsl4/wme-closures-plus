import { Model } from 'backbone';
import { UserRank } from '../user-rank';

export type User = Model<{
  id: number;
  userName: string;
  rank: UserRank;
  globalEditor: boolean;
}> & {
  getRank(): UserRank;
  isStaffUser(): boolean;
  toJSON(): object;
};
