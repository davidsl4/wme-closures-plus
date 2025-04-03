// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function getWindow<T extends object = {}>(): Window & T {
  if ('unsafeWindow' in window) return window.unsafeWindow as Window & T;
  return window as unknown as Window & T;
}
