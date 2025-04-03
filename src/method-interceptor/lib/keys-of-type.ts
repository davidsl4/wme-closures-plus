export type KeysOfType<Object, Type> = {
  [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KeysOfFunctions<Object> = KeysOfType<Object, (...args: any[]) => any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionOfTarget<Target, FnKey extends KeysOfFunctions<Target>> = Extract<Target[FnKey], (...args: any[]) => any>;
