import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationLayout } from '../components/registration/RegistrationLayout';
import { RegistrationStep1 } from '../components/registration/RegistrationStep1';
import { RegistrationStep2 } from '../components/registration/RegistrationStep2';
import { useRegistrationForm } from '../features/registration/hooks/useRegistrationForm';

export function Registration() {
  const navigate = useNavigate();
  const {
    step,
    formData,
    error,
    isSubmitting,
    handleNext,
    handleBack
  } = useRegistrationForm();

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <RegistrationLayout step={step} totalSteps={2}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {step === 1 && (
        <RegistrationStep1 
          data={formData} 
          onNext={handleNext}
          onCancel={handleCancel}
        />
      )}
      {step === 2 && (
        <RegistrationStep2 
          data={formData} 
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      )}
    </RegistrationLayout>
  );
}