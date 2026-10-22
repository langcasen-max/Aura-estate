import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://nkidcsnqquwtlcupuing.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Mi6dzpQX3qoFagn3iF3VfA_3cl4tGqd';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('example.supabase.co') &&
  !supabaseUrl.includes('<project-id>')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = client;

/**
 * Checks if a string is a valid UUID v4
 */
export function isUuid(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str.trim());
}
