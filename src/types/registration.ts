export interface RegistrationFormData {
  // Step 1
  name: string;
  surname: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  
  // Step 2
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
  error?: string;
}