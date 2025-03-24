export interface CustomElement<EM extends Record<keyof EM, Event>>
  extends HTMLElement {
  addEventListener<K extends keyof (HTMLElementEventMap & EM)>(
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: HTMLElement, ev: (HTMLElementEventMap & EM)[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof (HTMLElementEventMap & EM)>(
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: HTMLElement, ev: (HTMLElementEventMap & EM)[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
