import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { Content } from '../../../types/content';
import { NewContentHeader } from './NewContentHeader';
import { JobSteps } from './steps/JobSteps';
import { PromotionSteps } from './steps/PromotionSteps';
import { EventSteps } from './steps/EventSteps';
import { useContentFormManager } from '../../hooks/useContentFormManager';
import { useAutoSave } from '../../hooks/useAutoSave';

interface NewContentFormProps {
  type: Content['type'];
  onCancel: () => void;
}

export function NewContentForm({ type, onCancel }: NewContentFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    step,
    formData,
    error,
    isSubmitting,
    isDirty,
    handleNext,
    handleBack,
    saveDraft,
    publish
  } = useContentFormManager(type, user?.id || '', navigate);
  
  // Initialize auto-save
  useAutoSave(formData, isDirty);

  const handleStepNext = (stepData: Partial<Content>) => {
    handleNext(stepData);
  };

  const renderContent = () => {
    switch (type) {
      case 'job':
        return (
          <JobSteps
            step={step}
            formData={formData}
            onNext={handleStepNext}
            onBack={handleBack}
            onCancel={onCancel}
            onSaveDraft={saveDraft}
            onPublish={publish}
            isSubmitting={isSubmitting}
          />
        );
      case 'promotion':
        return (
          <PromotionSteps
            step={step}
            formData={formData}
            onNext={handleStepNext}
            onBack={handleBack}
            onCancel={onCancel}
            onSaveDraft={saveDraft}
            onPublish={publish}
            isSubmitting={isSubmitting}
          />
        );
      case 'event':
        return (
          <EventSteps
            step={step}
            formData={formData}
            onNext={handleStepNext}
            onBack={handleBack}
            onCancel={onCancel}
            onSaveDraft={saveDraft}
            onPublish={publish}
            isSubmitting={isSubmitting}
          />
        );
      default:
        console.error(`NewContentForm: Invalid type ${type}`);
        return <p>Error: Unsupported content type</p>;
    }
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewContentHeader 
        title={formData.title || 'Nuovo contenuto'}
        onCancel={onCancel}
        type={type}
        step={step}
        isSubmitting={isSubmitting}
      />
      
      {error && step > 1 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
}