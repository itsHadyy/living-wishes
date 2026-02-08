import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, onAuthStateChange, signInWithEmail, signUpWithEmail, signOut } from '../auth/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  const loadSession = useCallback(async () => {
    const { data } = await getSession();
    setSession(data?.session ?? null);
    setUser(data?.session?.user ?? null);
  }, []);

  useEffect(() => {
    loadSession().finally(() => setLoading(false));

    const unsubscribe = onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
    });

    return unsubscribe;
  }, [loadSession]);

  const openLogin = useCallback(() => setAuthModal('login'), []);
  const openSignup = useCallback(() => setAuthModal('signup'), []);
  const closeAuth = useCallback(() => setAuthModal(null), []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await signInWithEmail(email, password);
    if (!error && data?.session) {
      closeAuth();
      return { error: null };
    }
    return { error: error?.message ?? 'Sign in failed' };
  }, [closeAuth]);

  const signUp = useCallback(async (email, password, name) => {
    const { data, error } = await signUpWithEmail(email, password, { name });
    if (!error && data?.user) {
      closeAuth();
      return { error: null };
    }
    return { error: error?.message ?? 'Sign up failed' };
  }, [closeAuth]);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  const value = {
    user,
    session,
    loading,
    authModal,
    openLogin,
    openSignup,
    closeAuth,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
