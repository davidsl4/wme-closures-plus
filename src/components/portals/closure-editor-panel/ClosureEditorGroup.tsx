import { css } from '@emotion/css';
import clsx from 'clsx';
import { ReactNode } from 'react';

const groupClass = css({
  padding: 'var(--trimmed-padding)',
});
const groupWithBorderClass = css({
  borderBottom: '1px solid var(--hairline)',
});

interface ClosureEditorGroupProps {
  hasBorder?: boolean;
  children: ReactNode;
}
export function ClosureEditorGroup({
  hasBorder,
  children,
}: ClosureEditorGroupProps) {
  return (
    <div className={clsx(groupClass, hasBorder && groupWithBorderClass)}>
      {children}
    </div>
  );
}
