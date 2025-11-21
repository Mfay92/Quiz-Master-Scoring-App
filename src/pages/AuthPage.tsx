import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div>
      {mode === 'login' ? (
        <Login onSwitchToSignup={() => setMode('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setMode('login')} />
      )}
    </div>
  );
};

export default AuthPage;
