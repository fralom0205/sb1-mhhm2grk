import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { auth } from '../../config/firebase';
import { enableDevTools } from '../../utils/env';

export function VerificationHelper() {
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(true);

  useEffect(() => {
    if (!enableDevTools) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && !user.emailVerified) {
        try {
          // Get the verification URL
          const actionCodeSettings = {
            url: window.location.origin + '/email-verified',
            handleCodeInApp: true
          };
          const verificationUrl = await auth.generateEmailVerificationLink(
            user.email!,
            actionCodeSettings
          );
          setLastToken(verificationUrl);
        } catch (error) {
          console.error('Error generating verification link:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!lastToken || !showHelper || !enableDevTools) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-6 bg-white rounded-lg shadow-lg border border-orange-200 max-w-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Development Helper</h3>
        <button
          onClick={() => setShowHelper(false)}
          className="text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Verification Token:</p>
          <code className="block w-full bg-gray-50 px-3 py-2 rounded-md font-mono text-sm">
            {lastToken}
          </code>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-md p-4">
          <p className="text-sm text-orange-800 mb-3">
            Click the link below to verify your email address:
          </p>
          <Link
            to={`/verify-email/${lastToken}`}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            Verify Email
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}