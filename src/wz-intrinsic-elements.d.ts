import { DetailedHTMLProps, HTMLAttributes } from 'react';

type WzIntrinsicElement<T extends string> = `wz-${T}`;

type BaseHTMLProps<
  Element = HTMLElement,
  Attributes extends HTMLAttributes<Element> = HTMLAttributes<Element>,
> = Omit<DetailedHTMLProps<Attributes, Element>, 'className'> & {
  class?: string;
};

declare type WzIntrinsicElements = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K: WzIntrinsicElement<any>]: any;
};

declare global {
  namespace React {
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface IntrinsicElements extends WzIntrinsicElements {}
    }
  }
}
