import { createClient } from '@/lib/supabase/client';
import type { AuthError, User } from '@supabase/supabase-js';

export interface AuthService {
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<{ user: User | null; error: AuthError | null }>;
}

export const authService: AuthService = {
  signUp: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  },

  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
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