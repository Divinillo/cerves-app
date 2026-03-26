import { supabase } from './supabase';
import type { Profile } from '../types/database';

export interface AuthResponse {
  data?: any;
  error?: Error;
}

export interface UserResponse {
  data?: Profile;
  error?: Error;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              username,
            },
          ]);

        if (profileError) {
          return { error: profileError };
        }
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign up failed') };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign in failed') };
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Google sign in failed') };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      return error ? { error } : { data: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign out failed') };
    }
  },

  /**
   * Reset password with email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Password reset failed') };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { error: authError || new Error('Not authenticated') };
      }

      // Fetch full profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to get user') };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: any) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  },
};
