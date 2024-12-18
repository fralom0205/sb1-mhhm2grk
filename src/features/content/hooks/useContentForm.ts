import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, ContentType, JobContent, PromotionContent, EventContent } from '../../../types/content';
import { JobService, PromotionService, EventService } from '../../../services/content';
import { useAuth } from '../../auth/hooks/useAuth';

const services = {
  job: new JobService(),
  promotion: new PromotionService(),
  event: new EventService()
} as const;

type ContentServices = {
  job: JobContent;
  promotion: PromotionContent;
  event: EventContent;
};

export function useContentForm(type: ContentType) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Content>>({
    type,
    status: 'draft',
    views: 0,
    engagement: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = (stepData: Partial<Content>) => {
    // Deep merge the data to preserve nested objects
    const newData = {
      ...formData,
      ...stepData,
      ...(stepData.validityPeriod && {
        validityPeriod: {
          ...formData.validityPeriod,
          ...stepData.validityPeriod
        }
      }),
      ...(stepData.targetAudience && {
        targetAudience: stepData.targetAudience
      })
    };
    
    setFormData(newData);
    setError(null);
    
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSaveDraft = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const service = services[type as keyof typeof services];
      const contentData = {
        ...formData,
        userId: user.id,
        status: 'draft' as const
      };

      await service.create(contentData);

      navigate('/dashboard/content', {
        state: { 
          message: 'Bozza salvata con successo',
          type: 'success'
        }
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err.message : 'Error saving draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const service = services[type as keyof typeof services];
      if (service) {
        await service.create(user.id, { ...formData, status: 'published' as const });
      }

      navigate('/dashboard/content', {
        state: { message: 'Contenuto pubblicato con successo' }
      });
    } catch (err) {
      console.error('Error publishing content:', err);
      setError(err instanceof Error ? err.message : 'Error publishing content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    error,
    isSubmitting,
    handleNext,
    handleBack,
    handleSaveDraft,
    handlePublish
  };
}