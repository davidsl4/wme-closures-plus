interface ClosureAttributionBase {
  contributionTime: number;
}
interface ClosureCommunityEditorAttribution {
  channel: 'WME_COMMUNITY_EDITOR';
  credit: null;
  feedId: null;
  idInProvider: null;
  partnerId: null;
  userChannel: 'EDITOR';
}
interface UnknownClosureAttribution {
  channel: string;
  credit: unknown;
  feedId: unknown;
  idInProvider: unknown;
  partnerId: unknown;
  userChannel: string;
}

export type ClosureAttribution = ClosureAttributionBase & (ClosureCommunityEditorAttribution | UnknownClosureAttribution);

