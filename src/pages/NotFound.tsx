import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/hooks/useAuth';

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleNavigateBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-orange-500" />
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Pagina non trovata
          </h1>
          
          <p className="mt-4 text-lg text-gray-600">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>

          <div className="mt-8 space-y-4">
            <Button
              onClick={handleNavigateBack}
              fullWidth
            >
              <Home className="w-5 h-5 mr-2" />
              {isAuthenticated ? 'Torna alla dashboard' : 'Torna al login'}
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