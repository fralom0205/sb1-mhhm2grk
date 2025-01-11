import { EventStep1 } from './EventStep1';
import { EventStep2 } from './EventStep2';
import { EventStep3 } from './EventStep3';
import { EventStep4 } from './EventStep4';
import { EventStep5 } from './EventStep5';
import { EventContent } from '../../../../../types/content';

interface EventStepsProps {
  step: number;
  formData: Partial<EventContent>;
  onNext: (data: Partial<EventContent>) => void;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function EventSteps({
  step,
  formData,
  onNext,
  onBack,
  onCancel,
  onSaveDraft,
  onPublish,
  isSubmitting,
  isDirty
}: EventStepsProps) {
  switch (step) {
    case 1:
      return (
        <EventStep1
          data={formData}
          onNext={onNext}
          onCancel={onCancel}
          onSaveDraft={onSaveDraft}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
        />
      );
    case 2:
      return (
        <EventStep2
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 3:
      return (
        <EventStep3
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 4:
      return (
        <EventStep4
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 5:
      return (
        <EventStep5
          data={formData}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSubmitting={isSubmitting}
        />
      );
    default:
      return null;
  }
}