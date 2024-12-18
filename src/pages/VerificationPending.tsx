import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { VerificationHelper } from '../components/dev/VerificationHelper';

export function VerificationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <Mail className="h-12 w-12 text-orange-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Verifica la tua email</h2>
          <p className="mt-2 text-gray-600">
            Ti abbiamo inviato un'email con un link di verifica.
            Per favore, controlla la tua casella di posta e clicca sul link per attivare il tuo account.
          </p>
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Torna al login
            </Button>
          </div>
        </div>
      </div>
      <VerificationHelper />
    </div>
  );
}