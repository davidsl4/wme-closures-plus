import { asUInjectorComponent } from 'utils/as-uinjector-component';
import { RecurringClosure } from './RecurringClosure';
import { ClosureEditorFormContextProvider } from 'contexts/ClosureEditorFormContext';
import { useChangeTabPadding } from 'hooks';
import { ClosureEditorGroup } from './ClosureEditorGroup';
import { ClosurePresetDropdown } from 'components/closure-presets/ClosurePresetDropdown';

interface ClosureEditorPanelProps {
  target: HTMLElement;
}
function ClosureEditorPanel(props: ClosureEditorPanelProps) {
  const closestTab = props.target.closest<HTMLElement>('wz-tab');
  const originalPadding = useChangeTabPadding(closestTab, 0);
  if (originalPadding) {
    closestTab?.style?.setProperty?.(
      '--trimmed-padding',
      originalPadding.map((p) => `${p.value}${p.unit}`).join(' '),
    );
  }
  props.target.style.padding = `var(--trimmed-padding)`;

  return (
    <ClosureEditorFormContextProvider
      type="CLOSURES_GROUP_MODEL_DOM_FORM"
      target={props.target as HTMLFormElement}
    >
      <ClosureEditorGroup hasBorder>
        <ClosurePresetDropdown label="Select Closure Preset" />
      </ClosureEditorGroup>
      <RecurringClosure closureEditPanel={props.target} />
    </ClosureEditorFormContextProvider>
  );
}

const UInjectorComponent = asUInjectorComponent(ClosureEditorPanel, {
  targetSelector: '.edit-closure',
  position: 'BEFORE',
  wrapInContainer: false,
});
export { UInjectorComponent as ClosureEditorPanel };
