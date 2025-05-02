import { CURRENT_DATE_RESOLVER } from './current-date-resolver';
import { DAY_OF_WEEK_RESOLVER } from './day-of-week-resolver';

export * from './date-resolver';
export { CURRENT_DATE_RESOLVER, DAY_OF_WEEK_RESOLVER };

const ALL_RESOLVERS = [CURRENT_DATE_RESOLVER, DAY_OF_WEEK_RESOLVER];
export function getDateResolverByName(name: string) {
  const resolver = ALL_RESOLVERS.find((resolver) => resolver.name === name);
  if (resolver) return resolver;

  throw new Error(`Resolver with name "${name}" is not found.`);
}
