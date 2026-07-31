import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (input, init) => {
        const requestUrl = typeof input === "string" ? input : input.url;
        const isRefreshRequest = requestUrl.includes("grant_type=refresh_token");

        try {
          const response = await fetch(input, init);
          if (isRefreshRequest && !response.ok) {
            await client.auth.signOut({ scope: "local" });
          }
          return response;
        } catch (error) {
          if (isRefreshRequest) {
            await client.auth.signOut({ scope: "local" });
          }
          throw error;
        }
      },
    },
  });

  return client;
};

export const supabase = createSupabaseClient();
