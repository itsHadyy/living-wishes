/**
 * After verification: user completes sign up with name and optional password.
 * Then redirect to dashboard.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../auth/auth';
import { linkSignupToAuth } from '../auth/signupFlow';

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name || '');
    }
    if (user?.email && user?.id) {
      linkSignupToAuth(user.email, user.id);
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: err } = await updateProfile({
      full_name: name.trim() || undefined,
      password: password.trim().length >= 6 ? password : undefined,
    });

    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="flow-page">
        <div className="flow-page__bg" aria-hidden="true" />
        <div className="flow-page__card"><p className="flow-page__subtitle">Loading…</p></div>
      </div>
    );
  }

  return (
    <div className="flow-page complete-profile-page">
      <div className="flow-page__bg" aria-hidden="true" />
      <div className="flow-page__card flow-page__card--fade">
        <h1 className="flow-page__title">Complete your account</h1>
        <p className="flow-page__subtitle">
          Add your details. You can set a password to sign in without email links later.
        </p>

        <form onSubmit={handleSubmit} className="flow-form">
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
          <label className="flow-form__label flow-form__label--slide">
            <span>Password <em>(optional)</em></span>
            <input
              type="password"
              className="flow-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters – for signing in without email link"
              autoComplete="new-password"
              minLength={6}
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
            {submitting ? 'Saving…' : 'Complete & go to dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfilePage;
