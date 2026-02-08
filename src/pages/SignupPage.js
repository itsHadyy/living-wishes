/**
 * Signup: email + name. Supabase sends magic link when possible;
 * if it can't, we verify and redirect to complete profile.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitSignup } from '../auth/signupFlow';

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setEmailSent(false);

    const { success, error: err, email: savedEmail, sent } = await submitSignup(email, name);

    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    if (success && savedEmail) {
      if (sent) {
        setEmailSent(true);
      } else {
        navigate('/complete-profile', { replace: true });
      }
    }
  };

  return (
    <div className="flow-page signup-page">
      <div className="flow-page__bg" aria-hidden="true" />
      <div className="flow-page__card flow-page__card--slide">
        <h1 className="flow-page__title">Create your account</h1>
        <p className="flow-page__subtitle">
          Enter your email and name. We&apos;ll send you a link to verify, or you&apos;ll go straight to complete your details.
        </p>

        {emailSent ? (
          <div className="flow-form__success flow-form__success--scale">
            <p className="flow-form__success-text">
              Check your email for the sign-in link. Click it to complete your profile and finish signing up.
            </p>
            <p className="flow-page__footer" style={{ marginTop: '1rem' }}>
              <Link to="/login" className="flow-page__link">Log in</Link> if you already have an account.
            </p>
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
            <label className="flow-form__label flow-form__label--slide">
              <span>Name</span>
              <input
                type="text"
                className="flow-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
            {error && (
              <>
                <p className="flow-form__error flow-form__error--shake" role="alert">
                  {error}
                </p>
                {error.toLowerCase().includes('log in') && (
                  <p className="flow-page__footer" style={{ marginTop: 0 }}>
                    <Link to="/login" className="flow-page__link">Go to log in</Link>
                  </p>
                )}
              </>
            )}
            <button
              type="submit"
              className="flow-form__submit flow-form__submit--fade"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Continue'}
            </button>
          </form>
        )}

        {!emailSent && (
          <p className="flow-page__footer">
            Already have an account? <Link to="/login" className="flow-page__link">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
