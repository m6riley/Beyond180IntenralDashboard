import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getEnvConfig } from '../../config/env';
import type { Database } from './types';

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getEnvConfig();
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Dashboard reads via the anon key only. Do not reuse Coach180's
        // persisted browser session (same Supabase project / storage key).
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'internal-dashboard-supabase-auth',
      },
    });
  }

  return supabaseClient;
}

export function resetSupabaseClient(): void {
  supabaseClient = null;
}
