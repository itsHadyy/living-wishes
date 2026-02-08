/**
 * Step 2: Supabase client singleton
 *
 * Initializes the Supabase client once using env vars from .env.local.
 * Use this import everywhere you need Supabase (auth, database, storage).
 *
 * CRA: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
 * Next.js: would use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
