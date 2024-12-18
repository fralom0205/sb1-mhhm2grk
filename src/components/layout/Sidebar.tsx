import React from 'react';
import { LayoutDashboard, Bell, Package, Building2, Settings, HelpCircle, LogOut, User2, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';
import { NavigationItem } from '../../types';

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Contenuti', icon: Package, href: '/dashboard/content' },
  { label: 'Notifiche', icon: Bell, href: '/dashboard/notifications' },
  { label: 'Servizi', icon: Building2, href: '/dashboard/services' },
  { label: 'Impostazioni', icon: Settings, href: '/dashboard/settings' },
];

interface SidebarProps { 
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `avatars/${user.id}_${Date.now()}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      
      // Update user profile in Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        avatar: imageUrl
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose?.();
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/login');
      onClose?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div 
          onClick={() => handleNavigation('/dashboard')}
          className="flex items-center cursor-pointer"
        >
          <img
            src="https://www.universitybox.com/wp-content/uploads/2021/10/image001.png"
            alt="UniversityBox"
            className="h-8 object-contain"
          />
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <label className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User2 className="w-6 h-6 text-orange-500" />
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">
                {isUploading ? 'Uploading...' : 'Change'}
              </span>
            </div>
          </label>
          <div>
            <h3 className="font-medium text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{user?.brandName || 'Company'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-150 whitespace-nowrap w-full ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <HelpCircle className="w-5 h-5" />
          <span className="ml-3">Hai bisogno di aiuto?</span>
        </button>
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}