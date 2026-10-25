import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  isDesignatedAdminEmail,
  resolveUserRole,
  PRIMARY_ADMIN_EMAIL,
  PRIMARY_ADMIN_PASSWORD,
} from '../lib/security';
import { clearLocalFavorites } from '../services/favoriteService';
import { INITIAL_USERS } from '../services/mockData';
import { getUsers, createUser } from '../services/userService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<UserProfile>;
  signUp: (name: string, email: string, pass: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  setDemoRole: (role: 'user' | 'admin' | 'public') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'aura_estates_active_user';

function toUserProfile(authUser: User, profile: any): UserProfile {
  const email = (authUser.email || '').trim().toLowerCase();
  const metadataRole = authUser.user_metadata?.role || authUser.app_metadata?.role;
  const resolvedRole = resolveUserRole(email, profile?.role, metadataRole);

  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name:
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      (resolvedRole === 'admin' ? 'Administrator' : authUser.email?.split('@')[0] || 'Client'),
    phone: profile?.phone || undefined,
    avatar_url: profile?.avatar_url || undefined,
    role: resolvedRole,
    created_at: profile?.created_at || authUser.created_at || new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          // Re-verify role through resolveUserRole
          parsed.role = resolveUserRole(parsed.email, parsed.role);
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const hydrateUser = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      // If no active Supabase session, keep demo user only if specifically in demo session
      setUser(prev => {
        if (prev && !prev.id.startsWith('usr-')) {
          localStorage.removeItem(DEMO_USER_KEY);
          return null;
        }
        return prev;
      });
      return;
    }

    let profile: any = null;
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id,email,full_name,phone,avatar_url,role,created_at')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!error && data) {
          profile = data;
        }
      } catch {
        // Fall back gracefully if profiles table is restricted by RLS
      }
    }

    const activeUser = toUserProfile(authUser, profile);
    setUser(activeUser);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(activeUser));
  }, []);

  // Supabase Auth listener for live session management
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      if (error || !data.session?.user) {
        return;
      }
      void hydrateUser(data.session.user).finally(() => {
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
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
    }
    return supabase;
  };

  /**
   * Primary authentication handler:
   * Strictly enforces that ONLY bearbates512@gmail.com with password office@12
   * can ever log into the Admin Operations Console.
   * All other users are strictly client accounts with 'user' role.
   */
  const signIn = async (email: string, pass: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();

      if (!cleanEmail) {
        throw new Error('Please enter your email address.');
      }
      if (!cleanPass) {
        throw new Error('Please enter your password.');
      }

      // 1. Exclusive Administrator Authentication: bearbates512@gmail.com with password office@12
      if (cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        const isDesignatedPasswordMatch = cleanPass === PRIMARY_ADMIN_PASSWORD;

        // Also attempt live Supabase authentication
        let supabaseSuccess = false;
        let supabaseUser: User | null = null;
        if (supabase && isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPass,
            });
            if (!error && data?.user) {
              supabaseSuccess = true;
              supabaseUser = data.user;
            }
          } catch {
            // Handled via isDesignatedPasswordMatch
          }
        }

        // Accept if password matches designated 'office@12' OR Supabase verified it with that password
        if (isDesignatedPasswordMatch || supabaseSuccess) {
          const activeUser: UserProfile = {
            id: supabaseUser?.id || 'usr-admin-langcasen',
            email: PRIMARY_ADMIN_EMAIL,
            full_name: supabaseUser?.user_metadata?.full_name || 'Administrator',
            role: 'admin',
            created_at: supabaseUser?.created_at || new Date().toISOString(),
          };

          setUser(activeUser);
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(activeUser));
          return activeUser;
        }

        // Any other password for bearbates512@gmail.com is strictly rejected
        throw new Error('Invalid credentials. Please verify your email and password.');
      }

      // 2. All other accounts: CAN NEVER ACCESS ADMIN PANEL!
      // They authenticate normally as client / user
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          if (cleanEmail === 'marcus.vance@example.com') {
            const clientUser = INITIAL_USERS[2];
            setUser(clientUser);
            localStorage.setItem(DEMO_USER_KEY, JSON.stringify(clientUser));
            return clientUser;
          }
          throw new Error(error.message || 'Invalid credentials. Please verify your email and password.');
        }

        if (!data.user) {
          throw new Error('No user returned from Supabase authentication.');
        }

        const activeUser: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          role: 'user', // STRICTLY USER ROLE! Never admin!
          created_at: data.user.created_at || new Date().toISOString(),
        };

        setUser(activeUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(activeUser));
        return activeUser;
      }

      // Offline client testing fallback
      if (cleanEmail === 'marcus.vance@example.com') {
        const clientUser = INITIAL_USERS[2];
        setUser(clientUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(clientUser));
        return clientUser;
      }

      throw new Error('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        const newUser = await createUser({
          email: email.trim(),
          full_name: name.trim(),
          role: isDesignatedAdminEmail(email) ? 'admin' : 'user',
        });
        setUser(newUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
        return { needsEmailConfirmation: false };
      }

      const client = requireSupabase();
      const cleanEmail = email.trim().toLowerCase();
      const assignedRole = isDesignatedAdminEmail(cleanEmail) ? 'admin' : 'user';

      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name.trim(),
            role: assignedRole,
          },
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
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('[Auth] Supabase signOut error:', err);
        }
      }
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
      clearLocalFavorites();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');

    const updated: UserProfile = {
      ...user,
      full_name: data.full_name !== undefined ? data.full_name : user.full_name,
      phone: data.phone !== undefined ? data.phone : user.phone,
      avatar_url: data.avatar_url !== undefined ? data.avatar_url : user.avatar_url,
    };
    setUser(updated);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));

    if (supabase && isSupabaseConfigured && !user.id.startsWith('usr-')) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.full_name,
            phone: updated.phone,
            avatar_url: updated.avatar_url,
          })
          .eq('id', user.id);
      } catch {
        // Non-blocking
      }
    }
  };

  const forgotPassword = async (email: string) => {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const resetPassword = async (newPassword: string) => {
    const client = requireSupabase();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const setDemoRole = (targetRole: 'user' | 'admin' | 'public') => {
    if (targetRole === 'public') {
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
    } else if (targetRole === 'admin') {
      // Administrative access requires authenticating with bearbates512@gmail.com and password office@12
      window.location.href = '/login?next=' + encodeURIComponent('/admin');
    } else {
      const clientUser = INITIAL_USERS.find(u => u.role === 'user') || INITIAL_USERS[2];
      setUser(clientUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(clientUser));
    }
  };

  const role: UserRole = user ? user.role : 'public';
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(user);
  // Show demo controls only when unauthenticated or running mock sessions
  const isDemoMode = !isAuthenticated || (user !== null && user.id.startsWith('usr-'));

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
