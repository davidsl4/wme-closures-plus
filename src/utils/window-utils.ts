export function getWindow(): Window {
  if ('unsafeWindow' in window) return window.unsafeWindow as Window;
  return window;
}
