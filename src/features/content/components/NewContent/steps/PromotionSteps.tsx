import { PromotionStep1 } from './PromotionStep1';
import { PromotionStep2 } from './PromotionStep2';
import { PromotionStep3 } from './PromotionStep3';
import { PromotionStep4 } from './PromotionStep4';
import { PromotionStep5 } from './PromotionStep5';
import { PromotionContent } from '../../../../../types/content';

interface PromotionStepsProps {
  step: number;
  formData: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function PromotionSteps({
  step,
  formData,
  onNext,
  onBack,
  onCancel,
  onSaveDraft,
  onPublish,
  isSubmitting,
  isDirty
}: PromotionStepsProps) {
  switch (step) {
    case 1:
      return (
        <PromotionStep1
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
        <PromotionStep2
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 3:
      return (
        <PromotionStep3
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft} onPublish={function (): void {
            throw new Error('Function not implemented.');
          } } isSubmitting={false}        />
      );
    case 4:
      return (
        <PromotionStep4
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 5:
      return (
        <PromotionStep5
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