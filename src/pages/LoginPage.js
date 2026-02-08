/**
 * Step 4 – Login page: user enters email.
 * If is_verified in Supabase, send magic link. Session persists via Supabase auth (localStorage).
 * Smooth fade-in/out for inputs and messages.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestMagicLink } from '../auth/signupFlow';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setSent(false);

    const { success, error: err } = await requestMagicLink(email);

    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    if (success) {
      setSent(true);
    }
  };

  return (
    <div className="flow-page login-page">
      <div className="flow-page__bg" aria-hidden="true" />
      <div className="flow-page__card flow-page__card--fade">
        <h1 className="flow-page__title">Welcome back</h1>
        <p className="flow-page__subtitle">
          Enter your email and we&apos;ll send you a link to sign in.
        </p>

        {sent ? (
          <div className="flow-form__success flow-form__success--scale">
            <p className="flow-form__success-text">
              Check your email for the sign-in link. Click it to open your dashboard.
            </p>
            <button
              type="button"
              className="flow-form__submit flow-form__submit--fade"
              onClick={() => { setSent(false); setEmail(''); }}
            >
              Use another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flow-form">
            <label className="flow-form__label flow-form__label--slide">
              <span>Email</span>
              <input
                type="email"
                className="flow-form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            {error && (
              <p className="flow-form__error flow-form__error--shake" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="flow-form__submit flow-form__submit--fade"
              disabled={submitting}
            >
              {submitting ? 'Sending link…' : 'Send sign-in link'}
            </button>
          </form>
        )}

        <p className="flow-page__footer">
          Don&apos;t have an account? <Link to="/signup" className="flow-page__link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
