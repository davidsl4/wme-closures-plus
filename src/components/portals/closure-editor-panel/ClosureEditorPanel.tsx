import { asUInjectorComponent } from 'utils/as-uinjector-component';
import { RecurringClosure } from './RecurringClosure';
import { ClosureEditorFormContextProvider } from 'contexts/ClosureEditorFormContext';

interface ClosureEditorPanelProps {
  target: Element;
}
function ClosureEditorPanel(props: ClosureEditorPanelProps) {
  return (
    <ClosureEditorFormContextProvider
      type="CLOSURES_GROUP_MODEL_DOM_FORM"
      target={props.target as HTMLFormElement}
    >
      <RecurringClosure closureEditPanel={props.target} />
    </ClosureEditorFormContextProvider>
  );
}

const UInjectorComponent = asUInjectorComponent(ClosureEditorPanel, {
  targetSelector: '.edit-closure',
  wrapInContainer: false,
});
export { UInjectorComponent as ClosureEditorPanel };
