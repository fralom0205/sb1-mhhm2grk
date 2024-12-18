import React from 'react';
import { JobStep1 } from './JobStep1';
import { JobStep2 } from './JobStep2';
import { JobStep3 } from './JobStep3';
import { JobStep4 } from './JobStep4';
import { JobStep5 } from './JobStep5';
import { JobContent } from '../../../../../types/content';

interface JobStepsProps {
  step: number;
  formData: Partial<JobContent>;
  onNext: (data: Partial<JobContent>) => void;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function JobSteps({
  step,
  formData,
  onNext,
  onBack,
  onCancel,
  onSaveDraft,
  onPublish,
  isSubmitting,
  isDirty
}: JobStepsProps) {
  switch (step) {
    case 1:
      return (
        <JobStep1
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
        <JobStep2
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 3:
      return (
        <JobStep3
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 4:
      return (
        <JobStep4
          data={formData}
          onNext={onNext}
          onBack={onBack}
          onSaveDraft={onSaveDraft}
        />
      );
    case 5:
      return (
        <JobStep5
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