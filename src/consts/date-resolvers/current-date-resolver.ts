import { createDateResolver } from './date-resolver';

export const CURRENT_DATE_RESOLVER = createDateResolver(
  'CURRENT_DATE',
  () => new Date(),
);
