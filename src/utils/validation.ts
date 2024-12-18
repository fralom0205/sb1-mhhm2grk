export interface ValidationError {
  [key: string]: string;
}

export function validateRegistrationStep1(data: {
  name?: string;
  surname?: string;
  role?: string;
  email?: string;
  phone?: string;
  password?: string;
}): ValidationError {
  const errors: ValidationError = {};

  if (!data.name?.trim()) {
    errors.name = 'Il nome è obbligatorio';
  }

  if (!data.surname?.trim()) {
    errors.surname = 'Il cognome è obbligatorio';
  }

  if (!data.role) {
    errors.role = 'Seleziona un ruolo';
  }

  if (!data.email?.trim()) {
    errors.email = "L'email è obbligatoria";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Inserisci un indirizzo email valido';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Il numero di telefono è obbligatorio';
  } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
    errors.phone = 'Inserisci un numero di telefono valido (10 cifre)';
  }

  if (!data.password?.trim()) {
    errors.password = 'La password è obbligatoria';
  } else if (data.password.length < 8) {
    errors.password = 'La password deve contenere almeno 8 caratteri';
  }

  return errors;
}

export function validateRegistrationStep2(data: {
  brandName?: string;
  brandCategory?: string;
  salesChannel?: string;
  website?: string;
  studentMessage?: string;
}): ValidationError {
  const errors: ValidationError = {};

  if (!data.brandName?.trim()) {
    errors.brandName = 'Il nome del brand è obbligatorio';
  }

  if (!data.brandCategory) {
    errors.brandCategory = 'Seleziona una categoria';
  }

  if (!data.salesChannel) {
    errors.salesChannel = 'Seleziona un canale di vendita';
  }

  if (!data.website?.trim()) {
    errors.website = 'Il sito web è obbligatorio';
  } else if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(data.website)) {
    errors.website = 'Inserisci un URL valido';
  }

  return errors;
}