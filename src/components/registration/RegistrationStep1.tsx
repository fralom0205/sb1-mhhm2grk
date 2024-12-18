import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import { roleOptions } from '../../constants/formOptions';
import { validateRegistrationStep1 } from '../../utils/validation';
import { RegistrationStepProps } from '../../types/registration';

export function RegistrationStep1({ data, onNext }: RegistrationStepProps) {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const stepData = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      role: formData.get('role') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
    };

    const validationErrors = validateRegistrationStep1(stepData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nome"
          name="name"
          defaultValue={data.name}
          error={errors?.name}
          required
        />
        <Input
          label="Cognome"
          name="surname"
          defaultValue={data.surname}
          error={errors?.surname}
          required
        />
      </div>

      <Select
        label="Ruolo"
        name="role"
        options={roleOptions}
        defaultValue={data.role}
        error={errors?.role}
        required
      />

      <Input
        label="Email aziendale"
        type="email"
        name="email"
        defaultValue={data.email}
        error={errors?.email}
        required
      />

      <Input
        label="Numero di telefono"
        type="tel"
        name="phone"
        prefix="+39"
        defaultValue={data.phone}
        error={errors?.phone}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        defaultValue={data.password}
        error={errors?.password}
        required
      />

      <div className="text-sm text-gray-500">
        Cliccando sul pulsante "registrati" accetti l'
        <a href="#" className="text-orange-500 hover:text-orange-600">
          informativa sulla Privacy
        </a>
      </div>

      <Button type="submit" fullWidth>
        Registrati
      </Button>
    </form>
  );
}