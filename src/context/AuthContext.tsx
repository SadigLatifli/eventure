// src/contexts/AuthContext.tsx
import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { getToken, isAuthenticated, signOut, signIn } from '../utils/auth';
import { clearUserData } from '@/redux/userSlice';


interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  logout: () => Promise<void>;
  setTokenFromHeader: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());
  const [token, setToken] = useState<string | null>(getToken());
  const dispatch = useDispatch();

  // Effect to check authentication status on mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setToken(getToken());
  }, []);

  const logout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setToken(null);
    // Clear user data from Redux
    dispatch(clearUserData());
  };

  // Function to save token from request headers
  const setTokenFromHeader = async (token: string) => {
    try {
      await signIn(token);
      setIsLoggedIn(true);
      setToken(token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, logout, setTokenFromHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};