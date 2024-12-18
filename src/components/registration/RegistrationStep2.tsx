import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { brandCategoryOptions, salesChannelOptions } from '../../constants/formOptions';
import { validateRegistrationStep2 } from '../../utils/validation';
import { RegistrationStepProps } from '../../features/registration/types/registrationTypes';

export function RegistrationStep2({ 
  data, 
  onNext, 
  onBack, 
  isSubmitting 
}: RegistrationStepProps) {
  const [validationErrors, setValidationErrors] = useState({});
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const stepData = {
      brandName: formData.get('brandName') as string,
      brandCategory: formData.get('brandCategory') as string,
      salesChannel: formData.get('salesChannel') as string,
      website: formData.get('website') as string,
      studentMessage: formData.get('studentMessage') as string,
      companyLogo: companyLogo
    };

    const errors = validateRegistrationStep2(stepData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome del brand"
        name="brandName"
        defaultValue={data.brandName}
        error={validationErrors?.brandName}
        required
      />

      <Select
        label="Categoria del brand"
        name="brandCategory"
        options={brandCategoryOptions}
        defaultValue={data.brandCategory}
        error={validationErrors?.brandCategory}
        required
      />

      <Select
        label="Canale di vendita"
        name="salesChannel"
        options={salesChannelOptions}
        defaultValue={data.salesChannel}
        error={validationErrors?.salesChannel}
        required
      />

      <Input
        label="Sito web"
        type="url"
        name="website"
        defaultValue={data.website}
        error={validationErrors?.website}
        required
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Logo aziendale
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Company logo preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="company-logo"
              onChange={handleLogoChange}
            />
            <label
              htmlFor="company-logo"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Carica logo
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Formato consigliato: PNG o SVG con sfondo trasparente
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="studentMessage" className="block text-sm font-medium text-gray-700">
          Cosa vuoi comunicare agli studenti?
        </label>
        <textarea
          id="studentMessage"
          name="studentMessage"
          rows={4}
          defaultValue={data.studentMessage}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Indietro
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
        </Button>
      </div>
    </form>
  );
}