import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Please add them to your Environment Variables.');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } }, error: null }),
            signInWithPassword: async () => ({ data: { session: null }, error: { message: 'Supabase configuration missing' } }),
            signUp: async () => ({ data: { session: null }, error: { message: 'Supabase configuration missing' } }),
            signOut: async () => ({ error: null })
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => ({ data: null, error: null }),
                    order: () => ({ data: [], error: null })
                }),
                or: () => ({
                    order: () => ({ data: [], error: null })
                }),
                order: () => ({ data: [], error: null })
            }),
            insert: () => ({ data: null, error: null }),
            upsert: () => ({ data: null, error: null }),
            delete: () => ({ data: null, error: null })
        }),
        channel: () => ({
            on: () => ({
                subscribe: () => ({})
            })
        }),
        removeChannel: () => ({})
    };
