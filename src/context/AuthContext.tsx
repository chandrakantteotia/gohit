// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { auth } from '../firebase/config';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  getIdTokenResult,
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider wraps around your app to provide auth state globally
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check current user and get admin claim
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const tokenResult = await getIdTokenResult(user);
          // console.log("🔐 Custom Claims:", tokenResult.claims);
          setIsAdmin(tokenResult.claims.admin === true);
        } catch (error) {
          console.error('❌ Error getting token claims:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Function to logout
  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    isAdmin,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
