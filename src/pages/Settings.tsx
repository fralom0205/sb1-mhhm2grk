import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Bell, Shield, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../features/auth/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        name: formData.get('name'),
        brandName: formData.get('brandName'),
        phone: formData.get('phone'),
        website: formData.get('website'),
      };

      await updateDoc(doc(db, 'users', user.id), updates);
      setMessage({ type: 'success', text: 'Profilo aggiornato con successo' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore durante l\'aggiornamento del profilo' });
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profilo', icon: User },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'company', label: 'Azienda', icon: Building },
    { id: 'security', label: 'Sicurezza', icon: Shield },
  ];
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploadingLogo(true);
      
      // Upload logo to Firebase Storage
      const imageRef = ref(storage, `company-logos/${user.id}_${Date.now()}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      
      // Update user profile in Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        companyLogo: imageUrl
      });
      
      setMessage({ type: 'success', text: 'Logo aziendale aggiornato con successo' });
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage({ type: 'error', text: 'Errore durante il caricamento del logo' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Impostazioni
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestisci le impostazioni del tuo account
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  name="name"
                  defaultValue={user?.name}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Nome azienda"
                  name="brandName"
                  defaultValue={user?.brandName}
                  required
                />
                <Input
                  label="Telefono"
                  name="phone"
                  type="tel"
                  defaultValue={user?.phone}
                />
              </div>

              <Input
                label="Sito web"
                name="website"
                type="url"
                defaultValue={user?.website}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Salvataggio...' : 'Salva modifiche'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Preferenze notifiche</h3>
              <div className="space-y-4">
                {['email', 'push', 'sms'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        Notifiche {type}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Ricevi aggiornamenti tramite {type}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informazioni aziendali</h3>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Logo aziendale
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
                    {user?.companyLogo ? (
                      <img
                        src={user.companyLogo}
                        alt="Company logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="company-logo"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                    />
                    <label
                      htmlFor="company-logo"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      {isUploadingLogo ? 'Caricamento...' : 'Carica logo'}
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      Formato consigliato: PNG o SVG con sfondo trasparente
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Select
                  label="Settore"
                  name="industry"
                  options={[
                    { value: 'tech', label: 'Tecnologia' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'food', label: 'Food & Beverage' },
                  ]}
                />
                <Input
                  label="P.IVA"
                  name="vatNumber"
                />
              </div>
              <Input
                label="Indirizzo"
                name="address"
              />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Sicurezza account</h3>
              <div className="space-y-4">
                <Button variant="secondary">
                  Cambia password
                </Button>
                <Button variant="secondary">
                  Attiva autenticazione a due fattori
                </Button>
                <div className="border-t pt-4">
                  <Button variant="secondary" className="text-red-600 hover:text-red-700">
                    Elimina account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}