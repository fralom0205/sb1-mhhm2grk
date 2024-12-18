import React, { useState } from 'react';
import { Target, Briefcase, LineChart, SmilePlus, FileText } from 'lucide-react';
import { ServiceContactForm } from '../features/services/components/ServiceContactForm';

const services = [
  {
    id: 'top-talents',
    title: 'Top Talents',
    description: 'Accedi ai migliori talenti universitari per la tua azienda',
    icon: Target,
    color: 'orange',
  },
  {
    id: 'employer-branding',
    title: 'Employer Branding',
    description: 'Rafforza il tuo brand tra gli studenti universitari',
    icon: Briefcase,
    color: 'blue',
  },
  {
    id: 'insight-analysis',
    title: 'Insight Analysis',
    description: 'Analizza le tendenze e le preferenze degli studenti',
    icon: LineChart,
    color: 'green',
  },
  {
    id: 'event-management',
    title: 'Event Management',
    description: 'Organizza e gestisci eventi per gli studenti',
    icon: SmilePlus,
    color: 'purple',
  },
  {
    id: 'ooh',
    title: 'OOH',
    description: 'Raggiungi gli studenti con pubblicità out-of-home',
    icon: FileText,
    color: 'pink',
  },
];

export function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Richiedi i nostri servizi
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Seleziona il tipo di servizio che ti interessa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={`p-6 rounded-lg text-left transition-colors duration-200 ${
              service.color === 'orange' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' :
              service.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
              service.color === 'green' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
              service.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' :
              'bg-pink-50 text-pink-700 hover:bg-pink-100'
            }`}
          >
            <service.icon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-sm opacity-90">{service.description}</p>
          </button>
        ))}
      </div>

      {selectedService && (
        <ServiceContactForm
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}