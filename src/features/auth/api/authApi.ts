// src/features/auth/api/authApi.ts
import { createClient } from '../../../lib/supabase/client';
import { SignupFormData, LoginFormData } from '../validators/authValidators';

export const authApi = {
  signInWithGoogle: async (nextUrl?: string) => {
    if (nextUrl) {
      document.cookie = `portal_next=${encodeURIComponent(nextUrl)}; path=/; max-age=300; SameSite=Lax`;
    }
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/api/auth/callback`;
      
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
    if (error) throw error;
    return data;
  },

  signUpWithEmail: async (credentials: SignupFormData) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  },

  signInWithEmail: async (credentials: LoginFormData) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return data;
  },

  resetPassword: async (email: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  },

  updatePassword: async (password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  }
};
