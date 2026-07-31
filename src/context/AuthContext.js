import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const verifySupabaseAuthReachable = async () => {
  if (!supabaseUrl) {
    return { ok: false, error: new Error("VITE_SUPABASE_URL is not configured.") };
  }

  if (!supabaseAnonKey) {
    return { ok: false, error: new Error("VITE_SUPABASE_ANON_KEY is not configured.") };
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      cache: "no-store",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: new Error(
          `Supabase auth endpoint is unavailable (${response.status}). Try again in a minute after unpausing, then verify project status in the Supabase dashboard.`
        ),
      };
    }

    return { ok: true, error: null };
  } catch (_error) {
    return {
      ok: false,
      error: new Error(
        "Could not reach Supabase. Verify VITE_SUPABASE_URL points to an active Supabase project URL."
      ),
    };
  }
};

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

      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          await supabase.auth.signOut({ scope: "local" });
          if (mounted) setSession(null);
        } else if (mounted) {
          setSession(initialSession);
        }
      } catch (_error) {
        await supabase.auth.signOut({ scope: "local" });
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    const { data } = supabase
      ? supabase.auth.onAuthStateChange((event, nextSession) => {
          if (
            nextSession &&
            (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
            window.location.search.includes("code=")
          ) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

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
    if (!supabase) return { data: null, error: new Error("Supabase is not configured.") };

    const { ok, error: preflightError } = await verifySupabaseAuthReachable();
    if (!ok) return { data: null, error: preflightError };

    const redirectTo = `${window.location.origin}${window.location.pathname}`;

    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
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
