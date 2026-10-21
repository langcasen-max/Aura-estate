import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

function toUserProfile(authUser: User, profile: any): UserProfile {
  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
    phone: profile?.phone || undefined,
    avatar_url: profile?.avatar_url || undefined,
    // Authorization is based only on the database profile, never browser storage or user metadata.
    role: profile?.role === 'admin' ? 'admin' : 'user',
    created_at: profile?.created_at || authUser.created_at || new Date().toISOString(),
  };
}

import { INITIAL_USERS } from '../services/mockData';
import { getUsers, createUser } from '../services/userService';

const DEMO_USER_KEY = 'aura_estates_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always enable demo simulation controls while working with dummy data
  const isDemoMode = true;
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) return JSON.parse(saved);
      // Default to admin so admin console and management features are immediately testable
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const hydrateUser = useCallback(async (authUser: User | null) => {
    if (!authUser || !supabase || !isSupabaseConfigured) {
      setUser(null);
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id,email,full_name,phone,avatar_url,role,created_at')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      // Fail closed: an unreadable profile must never grant administrator access.
      setUser(toUserProfile(authUser, null));
      return;
    }
    setUser(toUserProfile(authUser, profile));
  }, []);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer database work until after the auth callback to avoid holding the auth lock.
      setTimeout(() => {
        if (!alive) return;
        setIsLoading(true);
        void hydrateUser(session?.user ?? null).finally(() => {
          if (alive) setIsLoading(false);
        });
      }, 0);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      void hydrateUser(data.session?.user ?? null).finally(() => {
        if (alive) setIsLoading(false);
      });
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [hydrateUser]);

  const requireSupabase = () => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file, then restart the app.');
    }
    return supabase;
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // If logging in with demo credentials, provide instant seamless access
      if (
        isDemoMode ||
        cleanEmail === 'admin@auraestates.luxury' ||
        cleanEmail === 'marcus.vance@example.com' ||
        cleanEmail === 'admin@auraestates.com'
      ) {
        const users = getUsers();
        const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
        const activeUser: UserProfile = matched || (cleanEmail.includes('admin') ? INITIAL_USERS[0] : INITIAL_USERS[1]);
        setUser(activeUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(activeUser));
        return;
      }

      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) {
          const users = getUsers();
          const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
          if (matched) {
            setUser(matched);
            localStorage.setItem(DEMO_USER_KEY, JSON.stringify(matched));
            return;
          }
          throw error;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        const newUser = await createUser({
          email: email.trim(),
          full_name: name.trim(),
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        });
        setUser(newUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
        return { needsEmailConfirmation: false };
      }

      const client = requireSupabase();
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
      return { needsEmailConfirmation: Boolean(data.user && !data.session) };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      setUser(null);
      if (isDemoMode) {
        localStorage.removeItem(DEMO_USER_KEY);
      }
      clearLocalFavorites();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');

    if (isDemoMode) {
      const updated: UserProfile = {
        ...user,
        full_name: data.full_name !== undefined ? data.full_name : user.full_name,
        phone: data.phone !== undefined ? data.phone : user.phone,
        avatar_url: data.avatar_url !== undefined ? data.avatar_url : user.avatar_url,
      };
      setUser(updated);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
      return;
    }

    const client = requireSupabase();
    const updates = {
      full_name: data.full_name,
      phone: data.phone,
      avatar_url: data.avatar_url,
    };
    const { data: profile, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id,email,full_name,phone,avatar_url,role,created_at')
      .single();
    if (error) throw error;
    setUser({
      ...user,
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      role: profile.role === 'admin' ? 'admin' : 'user',
    });
  };

  const forgotPassword = async (email: string) => {
    if (isDemoMode) return;
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const resetPassword = async (newPassword: string) => {
    if (isDemoMode) return;
    const client = requireSupabase();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  // Demo role switching: allows testing Visitor vs Client vs Admin directly
  const setDemoRole = (targetRole: 'user' | 'admin' | 'public') => {
    if (targetRole === 'public') {
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
    } else if (targetRole === 'admin') {
      const adminUser = INITIAL_USERS[0];
      setUser(adminUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(adminUser));
    } else {
      const clientUser = INITIAL_USERS[1];
      setUser(clientUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(clientUser));
    }
  };

  const role: UserRole = user ? user.role : 'public';
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{
      user, role, isAdmin, isAuthenticated, isLoading, isDemoMode,
      signIn, signUp, signOut, updateProfile, forgotPassword, resetPassword, setDemoRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
