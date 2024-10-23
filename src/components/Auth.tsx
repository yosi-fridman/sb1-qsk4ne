import React, { useEffect, useRef } from 'react';

interface AuthProps {
  onAuthChange: (token: string | null) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const Auth: React.FC<AuthProps> = ({ onAuthChange }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '73181426848-6b6t1e0iobmc4n51i2p2f6lsr9c9n2me.apps.googleusercontent.com', // Replace this with your actual Google Client ID
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
        });
      }
    };

    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = (response: any) => {
    const token = response.credential;
    onAuthChange(token);
  };

  const handleSignOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    onAuthChange(null);
  };

  return (
    <div className="flex items-center space-x-4">
      <div ref={googleButtonRef}></div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Auth;