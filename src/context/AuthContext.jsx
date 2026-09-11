import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCandidateProfile, loginCandidate, logoutCandidate, registerCandidate } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  const checkAuth = async () => {
    try {
      const profile = await getCandidateProfile();
      if (profile && profile.id) {
        setCandidate(profile);
      } else {
        setCandidate(null);
      }
    } catch (err) {
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    await loginCandidate(email, password);
    await checkAuth();
  };

  const register = async (data) => {
    await registerCandidate(data);
    // Automatically log in after registration
    await loginCandidate(data.email, data.password);
    await checkAuth();
  };

  const logout = async () => {
    await logoutCandidate();
    setCandidate(null);
  };

  return (
    <AuthContext.Provider
      value={{
        candidate,
        isAuthenticated: !!candidate,
        loading,
        login,
        register,
        logout,
        refreshProfile: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
