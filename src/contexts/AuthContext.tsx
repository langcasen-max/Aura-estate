import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_USERS } from '../services/mockData';
import { clearLocalFavorites } from '../services/favoriteService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  setDemoRole: (role: 'user' | 'admin' | 'public') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_STORAGE_KEY = 'aura_estates_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      // Default to admin in demo mode for frictionless QA, or null if logged out
      return raw ? JSON.parse(raw) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const isDemoMode = !isSupabaseConfigured;

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }, [user]);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        // Demo sign in: if email contains admin, login as admin, else client
        if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('julian')) {
          setUser(INITIAL_USERS[0]);
        } else {
          setUser({
            id: `usr-${Date.now()}`,
            email: email.trim().toLowerCase(),
            full_name: email.split('@')[0],
            role: 'user',
            created_at: new Date().toISOString(),
          });
        }
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: profile?.full_name || data.user.user_metadata?.full_name,
          phone: profile?.phone,
          avatar_url: profile?.avatar_url,
          role: profile?.role || 'user',
          created_at: profile?.created_at || new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          full_name: name.trim(),
          role: 'user',
          created_at: new Date().toISOString(),
        };
        setUser(newUser);
        return { needsEmailConfirmation: false };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name },
        },
      });
      if (error) throw error;

      if (data.user && !data.session) {
        return { needsEmailConfirmation: true };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: name,
          role: 'user',
          created_at: new Date().toISOString(),
        });
      }
      return { needsEmailConfirmation: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      clearLocalFavorites();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    const updated: UserProfile = { ...user, ...data };
    setUser(updated);

    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    }
    // In demo mode, resolves smoothly
  };

  const resetPassword = async (newPassword: string) => {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    }
  };

  const setDemoRole = (targetRole: 'user' | 'admin' | 'public') => {
    if (targetRole === 'public') {
      setUser(null);
    } else if (targetRole === 'admin') {
      setUser(INITIAL_USERS[0]);
    } else {
      setUser(INITIAL_USERS[1]);
    }
  };

  const role: UserRole = user ? user.role : 'public';
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isAuthenticated,
        isLoading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateProfile,
        forgotPassword,
        resetPassword,
        setDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
