import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegistrationFormData } from '../../../types/registration';
import { register } from '../services/registrationService';

export function useRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.googleAuth) {
      setIsGoogleAuth(true);
      setStep(2); // Skip to business info for Google users
      // Pre-fill email from Google auth if available
      if (location.state?.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
    }
  }, [location.state]);

  const handleNext = async (stepData: Partial<RegistrationFormData>) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);
    setError('');
    
    if (step < 2 && !isGoogleAuth) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(newData as RegistrationFormData, isGoogleAuth);
      if (result.success) {
        navigate('/login', {
          replace: true,
          state: {
            message: isGoogleAuth 
              ? 'Registrazione completata! Puoi accedere con il tuo account Google.'
              : 'Registrazione completata! Controlla la tua email per verificare l\'account.',
            type: 'success'
          }
        });
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Si è verificato un errore durante la registrazione. Riprova più tardi.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  return {
    step,
    formData,
    error,
    isSubmitting,
    handleNext,
    handleBack
  };
}