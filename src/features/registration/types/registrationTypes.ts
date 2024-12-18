export interface RegistrationFormData {
  // Step 1 - Personal Information
  name: string;
  surname: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  
  // Step 2 - Business Information
  brandName: string;
  brandCategory: string;
  salesChannel: string;
  website: string;
  studentMessage?: string;
}

export interface RegistrationStepProps {
  data: Partial<RegistrationFormData>;
  onNext: (data: Partial<RegistrationFormData>) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  error?: string;
}