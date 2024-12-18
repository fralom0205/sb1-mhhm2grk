export interface User {
  name: string;
  role: string;
  avatar?: string;
}

export interface NavigationItem {
  label: string;
  icon: React.ComponentType;
  href: string;
}