/**
 * Step 3 – Verification page: user enters 6-digit code.
 * Validate against Supabase, check 15-min expiry. On success: is_verified = true, clear code, transition to dashboard.
 * Wrong code: shake input. Success: smooth transition to dashboard.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyCode } from '../auth/signupFlow';

function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setShake(false);

    const { success, error: err } = await verifyCode(email, code);

    setSubmitting(false);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    if (success) {
      navigate('/complete-profile', { replace: true });
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flow-page verify-page">
      <div className="flow-page__bg" aria-hidden="true" />
      <div className="flow-page__card flow-page__card--fade">
        <h1 className="flow-page__title">Check your code</h1>
        <p className="flow-page__subtitle">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
        </p>

        <form onSubmit={handleSubmit} className="flow-form">
          <label className={`flow-form__label flow-form__label--slide ${shake ? 'flow-form__label--shake' : ''}`}>
            <span>Verification code</span>
            <input
              type="text"
              className="flow-form__input flow-form__input--code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
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
            disabled={submitting || code.length !== 6}
          >
            {submitting ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>

        <p className="flow-page__footer">
          Wrong email? <Link to="/signup" className="flow-page__link">Sign up again</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyPage;
