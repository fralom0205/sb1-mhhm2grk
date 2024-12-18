import React from 'react';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}

export function RegistrationLayout({ children, step, totalSteps }: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <img 
              src="/logo.svg" 
              alt="UniversityBox Manager" 
              className="h-8 mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hai un'azienda e vuoi comunicare agli studenti d'Italia? Siamo qui per te!
            </h1>
            <p className="text-gray-600">
              Pubblica promozioni e offerte di lavoro su UniversityBox, la piattaforma con la community studentesca più grande d'Italia.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i + 1 <= step ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {step} Informazioni di contatto
            </div>
          </div>

          {children}
        </div>
        
        <div className="hidden lg:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=1200&fit=crop"
            alt="Students"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}