/**
 * Signup / login flow using Supabase only (no Resend).
 * Signup: try to send magic link (signInWithOtp). If Supabase can't send email,
 * fall back to creating user and signing in, then user completes details.
 */

import { supabase } from '../supabaseClient';

function randomPassword() {
  return Math.random().toString(36).slice(2) + 'Aa1!';
}

/** Check if error means "user already exists" / conflict */
function isAlreadyRegistered(err) {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const status = err.status || err.code;
  return (
    status === 409 ||
    status === 422 ||
    msg.includes('already registered') ||
    msg.includes('user already exists') ||
    msg.includes('already been registered')
  );
}

/**
 * Signup: save email + name, then try Supabase magic link.
 * If that fails (429 rate limit, or email not configured), fall back to signUp + signIn.
 * If user already exists, we tell them to log in instead.
 * Returns { success, error, email, sent } – sent = true if magic link was sent.
 */
export async function submitSignup(email, name) {
  const normalizedEmail = email.trim().toLowerCase();
  const displayName = (name || '').trim() || null;

  const { error: upsertError } = await supabase
    .from('signups')
    .upsert(
      {
        email: normalizedEmail,
        name: displayName,
        verification_code: null,
        verification_code_sent_at: null,
        is_verified: false,
        auth_uid: null,
      },
      { onConflict: 'email' }
    );

  if (upsertError) {
    return { success: false, error: upsertError.message, email: null, sent: false };
  }

  // Try Supabase magic link – when they click, they land on /complete-profile
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      data: { full_name: displayName || '' },
      emailRedirectTo: window.location.origin + '/complete-profile',
    },
  });

  if (!otpError) {
    return { success: true, error: null, email: normalizedEmail, sent: true };
  }

  // Rate limit or other send failure: fall back to signUp + signIn so they can complete profile
  const password = randomPassword();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: displayName || '' },
      emailRedirectTo: window.location.origin + '/complete-profile',
    },
  });

  if (signUpError) {
    if (isAlreadyRegistered(signUpError)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please log in.',
        email: normalizedEmail,
        sent: false,
      };
    }
    return { success: false, error: signUpError.message, email: null, sent: false };
  }

  // Supabase can return user without session when email already exists (e.g. magic link created user)
  const authUid = signUpData?.user?.id;
  const hasSession = !!signUpData?.session;

  if (!authUid) {
    return { success: false, error: 'Could not create account.', email: null, sent: false };
  }

  // If we got a session from signUp, user was new; otherwise they may already exist
  if (!hasSession) {
    return {
      success: false,
      error: 'An account with this email already exists. Please log in.',
      email: normalizedEmail,
      sent: false,
    };
  }

  // Link signup row to auth user (ignore 409 – row may already be linked)
  const { error: linkError } = await supabase.rpc('link_signup_to_auth', {
    p_email: normalizedEmail,
    p_auth_uid: authUid,
  });
  const isLinkConflict = linkError && (linkError.status === 409 || linkError.code === '409' || (linkError.message || '').toLowerCase().includes('conflict'));
  if (linkError && !isLinkConflict) {
    // Log but don't block – user already has session from signUp
  }

  // We already have session from signUp when user was new; no need to sign in again
  return { success: true, error: null, email: normalizedEmail, sent: false };
}

/**
 * Link the signups row to the current auth user. Call when user lands on complete-profile
 * (e.g. after clicking magic link) so is_email_verified works for login later.
 * Ignores 409 (already linked).
 */
export async function linkSignupToAuth(email, authUid) {
  const { error } = await supabase.rpc('link_signup_to_auth', {
    p_email: email?.trim().toLowerCase(),
    p_auth_uid: authUid,
  });
  if (error && (error.status === 409 || error.code === '409' || (error.message || '').toLowerCase().includes('conflict'))) return true;
  return !error;
}

/**
 * Login: if email is verified, send magic link. Session persists in Supabase.
 */
export async function requestMagicLink(email) {
  const normalized = email.trim().toLowerCase();

  const { data: verified, error: rpcError } = await supabase.rpc('is_email_verified', {
    p_email: normalized,
  });

  if (rpcError) {
    return { success: false, error: 'Could not check account. Please try again.' };
  }

  if (!verified) {
    return {
      success: false,
      error: 'No verified account found for this email. Please sign up first.',
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      emailRedirectTo: window.location.origin + '/dashboard',
    },
  });

  if (error) {
    if (error.status === 429) {
      return {
        success: false,
        error: 'Too many attempts. Please wait a few minutes and try again.',
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
