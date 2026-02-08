/**
 * Step 3: Supabase authentication (email-only for MVP)
 *
 * Dashboard config (Supabase → Authentication → Providers):
 * - Email: enabled (default). Uses "Confirm email" if you enable it in Auth Settings.
 * - For MVP, you can disable other providers (Google, GitHub, etc.) so only email is used.
 *
 * This module exposes sign-up, sign-in, sign-out, and session helpers.
 */

import { supabase } from '../supabaseClient';

/**
 * Sign up with email and password.
 * Supabase may send a confirmation email depending on your project settings.
 * @returns {Promise<{ data, error }>} - data.user and data.session on success
 */
export async function signUpWithEmail(email, password, options = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: options.name ? { full_name: options.name } : undefined,
      emailRedirectTo: options.redirectTo,
    },
  });
  return { data, error };
}

/**
 * Sign in with email and password.
 * @returns {Promise<{ data, error }>} - data.user and data.session on success
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Update current user profile (name) and optionally set a password for future logins.
 * @returns {Promise<{ error: string | null }>}
 */
export async function updateProfile({ full_name, password }) {
  const updates = {};
  if (full_name != null) updates.data = { full_name: String(full_name).trim() || undefined };
  if (password && password.length >= 6) updates.password = password;
  if (Object.keys(updates).length === 0) return { error: null };
  const { error } = await supabase.auth.updateUser(updates);
  return { error: error?.message ?? null };
}

/**
 * Get the current session (user + access token). Use for initial load or checks.
 * @returns {Promise<{ data: { session }, error }>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data: data?.session ? { session: data.session } : { session: null }, error };
}

/**
 * Get the current user from the session. Convenience wrapper.
 * @returns {Promise<{ user: User | null, error }>}
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

/**
 * Subscribe to auth state changes (login, logout, token refresh).
 * @param {(event, session) => void} callback
 * @returns {() => void} - unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => subscription.unsubscribe();
}
