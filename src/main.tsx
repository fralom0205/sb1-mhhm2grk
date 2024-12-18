import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupApp } from './config/setup';
import App from './App.tsx';
import './index.css';

// Initialize app
setupApp().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
