import {
  UInjector,
  UInjectorProps,
  UInjectorRenderUIOptions,
} from 'components';
import { ComponentType, FunctionComponent } from 'react';
import { getDisplayName } from './get-display-name';

export type UInjectorComponentProps = UInjectorRenderUIOptions;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function asUInjectorComponent<P extends {}>(
  Component: ComponentType<P & UInjectorComponentProps>,
  options: Omit<UInjectorProps, 'renderUI'>,
): ComponentType<P & Partial<typeof options>> {
  const UInjectorComponent: FunctionComponent<P & typeof options> = (props) => {
    props = Object.assign({}, options, props);

    return (
      <UInjector
        {...props}
        renderUI={(options) => <Component {...options} {...props} />}
      />
    );
  };
  UInjectorComponent.displayName = `asUInjector(${getDisplayName(Component)})`;

  return UInjectorComponent;
}
