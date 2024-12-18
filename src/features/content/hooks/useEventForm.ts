import { useState, useCallback } from 'react';
import { EventContent } from '../../../types/content';

export function useEventForm(initialData: Partial<EventContent> = {}) {
  const [formData, setFormData] = useState<Partial<EventContent>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof EventContent, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for updated field
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }
    if (!formData.eventType) {
      newErrors.eventType = 'Seleziona un tipo di evento';
    }
    if (!formData.eventLocation) {
      newErrors.eventLocation = 'Seleziona una modalità';
    }
    if (!formData.eventDate) {
      newErrors.eventDate = 'Seleziona una data';
    }
    if (!formData.venue?.trim()) {
      newErrors.venue = 'Inserisci una location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    setErrors
  };
}