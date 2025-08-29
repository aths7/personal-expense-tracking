import { createClient } from '@/lib/supabase/client';
import type { AuthError, User, AuthOtpResponse } from '@supabase/supabase-js';

export interface AuthService {
  signUp: (email: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string) => Promise<{ error: AuthError | null }>;
  verifyOtp: (email: string, token: string, type: 'signup' | 'magiclink') => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<{ user: User | null; error: AuthError | null }>;
}

export const authService: AuthService = {
  signUp: async (email: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      },
    });
    return { user: data.user, error };
  },

  signIn: async (email: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
        shouldCreateUser: false, // Don't create user if they don't exist
      },
    });
    return { error };
  },

  verifyOtp: async (email: string, token: string, type: 'signup' | 'magiclink') => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    return { user: data.user, error };
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },
};