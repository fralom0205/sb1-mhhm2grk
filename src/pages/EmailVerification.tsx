import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { verifyEmail } from '../services/verification.service';
import { Button } from '../components/ui/Button';

export function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) throw new Error('Token mancante');
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/email-verified', { replace: true });
        }, 1500);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <h2 className="mt-4 text-xl font-semibold">Verifica in corso...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-green-700">Email verificata con successo!</h2>
              <p className="mt-2 text-gray-600">Ora puoi accedere al tuo account.</p>
              <Button
                className="mt-6"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Vai al login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-red-700">Verifica fallita</h2>
              <p className="mt-2 text-gray-600">Il link di verifica non è valido o è scaduto.</p>
              <Button
                className="mt-6"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Torna al login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}