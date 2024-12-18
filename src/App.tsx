import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/contexts/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { Registration } from './pages/Registration';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { EmailVerification } from './pages/EmailVerification';
import { EmailVerified } from './pages/EmailVerified';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerificationPending } from './pages/VerificationPending';
import { Home } from './pages/Home';
import { Content } from './pages/Content';
import { ContentDetail } from './pages/ContentDetail';
import { NewContent } from './pages/NewContent';
import { EditContent } from './pages/EditContent';
import { Services } from './pages/Services';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification-pending" element={<VerificationPending />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route index element={<Home />} />
                    <Route path="content" element={<Content />} />
                    <Route path="content/:id" element={<ContentDetail />} />
                    <Route path="content/:id/edit" element={<EditContent />} />
                    <Route path="content/new" element={<NewContent />} />
                    <Route path="services" element={<Services />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}