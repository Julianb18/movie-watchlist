import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(initialSession);
        setLoading(false);
      }
    };

    bootstrap();

    const { data } = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setLoading(false);
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email, password) => {
    if (!supabase) return { error: new Error("Supabase is not configured.") };
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email, password) => {
    if (!supabase) return { error: new Error("Supabase is not configured.") };
    return supabase.auth.signUp({ email, password });
  };

  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error("Supabase is not configured.") };
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    if (!supabase) return { error: new Error("Supabase is not configured.") };
    return supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isConfigured: Boolean(supabase),
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
