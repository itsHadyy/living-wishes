import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';

function AuthModal() {
  const { authModal, closeAuth, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOpen = authModal === 'login' || authModal === 'signup';

  useEffect(() => {
    if (authModal === 'signup') setMode('signup');
    if (authModal === 'login') setMode('login');
  }, [authModal]);

  const handleClose = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setSubmitting(false);
    closeAuth();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      setError(err ?? '');
    } else {
      const { error: err } = await signUp(email, password, name);
      setError(err ?? '');
    }

    setSubmitting(false);
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="auth-modal">
      <div className="auth-modal__inner">
        <button
          type="button"
          className="auth-modal__close"
          onClick={handleClose}
          aria-label="Close"
        />
        <h2 className="auth-modal__title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="auth-modal__subtitle">
          {mode === 'login'
            ? 'Sign in to continue to Living Wishes.'
            : 'Start leaving words that last.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label className="auth-form__label">
              <span>Name</span>
              <input
                type="text"
                className="auth-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}
          <label className="auth-form__label">
            <span>Email</span>
            <input
              type="email"
              className="auth-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-form__label">
            <span>Password</span>
            <input
              type="password"
              className="auth-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-modal__switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className="auth-modal__switch-btn" onClick={switchMode}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </Modal>
  );
}

export default AuthModal;
