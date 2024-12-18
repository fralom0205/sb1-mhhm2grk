import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function EmailVerified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email verificata!
          </h2>
          
          <p className="mt-4 text-lg text-gray-600">
            Il tuo account è stato verificato con successo.
            Ora puoi accedere a tutte le funzionalità della piattaforma.
          </p>

          <div className="mt-8 space-y-4">
            <Button
              onClick={() => navigate('/login')}
              fullWidth
            >
              Accedi al tuo account
            </Button>
            
            <p className="text-sm text-gray-500">
              Hai bisogno di aiuto?{' '}
              <a href="/support" className="font-medium text-orange-600 hover:text-orange-500">
                Contattaci
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}