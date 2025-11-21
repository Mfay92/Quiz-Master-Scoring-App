import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to add timeout to promises
const withTimeout = <T,>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session with timeout (5 seconds)
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          5000,
          'Connection timeout. Please check your internet connection and try again.'
        );

        if (session?.user) {
          setUser(session.user);
          // Fetch user profile with timeout (5 seconds)
          try {
            await withTimeout(
              fetchProfileInternal(session.user.id),
              5000,
              'Profile loading timeout'
            );
          } catch (profileError) {
            // Profile fetch failed but we have a valid session
            // Allow the app to load anyway
            console.warn('Profile fetch failed:', profileError);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize authentication';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Don't await profile fetch here to avoid blocking
          fetchProfileInternal(session.user.id).catch(err => {
            console.warn('Profile fetch on auth change failed:', err);
          });
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfileInternal = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, will create on signup
        console.log('Profile not found, will create on signup');
        return;
      }
      throw error;
    }
    setProfile(data);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      // Sign up user with timeout
      const { data: { user: newUser }, error: signUpError } = await withTimeout(
        supabase.auth.signUp({ email, password }),
        10000,
        'Sign up timeout. Please try again.'
      );

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('Failed to create user');

      // Create profile with timeout
      const profileResult = await withTimeout(
        Promise.resolve(supabase.from('profiles').insert({
          id: newUser.id,
          display_name: displayName,
          email
        }).select()),
        5000,
        'Profile creation timeout. Please try again.'
      );

      if (profileResult.error) throw profileResult.error;

      setUser(newUser);
      await fetchProfileInternal(newUser.id);
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { data: { user: signedInUser }, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        'Sign in timeout. Please check your connection and try again.'
      );

      if (error) throw error;
      if (signedInUser) {
        setUser(signedInUser);
        // Fetch profile but don't block login if it fails
        try {
          await withTimeout(
            fetchProfileInternal(signedInUser.id),
            5000,
            'Profile loading timeout'
          );
        } catch (profileError) {
          console.warn('Profile fetch failed after login:', profileError);
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (displayName: string) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: displayName } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
