import { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { supabase } from '../services/supabase';
import type { Profile } from '../types/database';

export interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  onboardingDone: boolean;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  completeOnboarding: (nickname: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(() => {
    try { return localStorage.getItem('cerves_onboarding_done') === 'true'; }
    catch { return false; }
  });

  // Fetch profile when user changes
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user || null);

        if (user) {
          await fetchProfile(user.id);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [fetchProfile]);

  // Listen to auth state changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, username: string) => {
    const result = await authService.signUp(email, password, username);
    if (result.data?.user) {
      setUser(result.data.user);
      await fetchProfile(result.data.user.id);
    }
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.data?.user) {
      setUser(result.data.user);
      await fetchProfile(result.data.user.id);
    }
    return result;
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signOut = async () => {
    const result = await authService.signOut();
    if (!result.error) {
      setUser(null);
      setProfile(null);
    }
    return result;
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const completeOnboarding = (nickname: string) => {
    // Save nickname to profile (locally for now, Supabase later)
    setProfile((prev) => prev ? { ...prev, username: nickname } : {
      id: user?.id || '',
      username: nickname,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setOnboardingDone(true);
    try { localStorage.setItem('cerves_onboarding_done', 'true'); } catch {}
    // Also try to save to Supabase
    if (user?.id) {
      supabase.from('profiles').upsert({
        id: user.id,
        username: nickname,
        updated_at: new Date().toISOString(),
      }).then(() => {});
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    onboardingDone,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
