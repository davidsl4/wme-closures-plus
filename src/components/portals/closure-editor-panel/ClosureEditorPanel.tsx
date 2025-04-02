import { asUInjectorComponent } from 'utils/as-uinjector-component';
import { RecurringClosure } from './RecurringClosure';

interface ClosureEditorPanelProps {
  target: Element;
}
function ClosureEditorPanel(props: ClosureEditorPanelProps) {
  return (
    <>
      <RecurringClosure closureEditPanel={props.target} />
    </>
  );
}

const UInjectorComponent = asUInjectorComponent(ClosureEditorPanel, {
  targetSelector: '.edit-closure',
  targetFilter: (element) => {
    return !element.closest('div[class^=turnClosuresEditViewContainer]');
  },
  wrapInContainer: false,
});
export { UInjectorComponent as ClosureEditorPanel };
