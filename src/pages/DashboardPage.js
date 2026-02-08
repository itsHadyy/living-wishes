/**
 * Step 5 – Dashboard: Welcome [name], Create your first wish button.
 * Subtle background: floating pastel shapes. Session from Supabase (user stays logged in).
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  if (loading) {
    return (
      <div className="flow-page dashboard-page">
        <div className="flow-page__bg" aria-hidden="true" />
        <div className="flow-page__card"><p className="flow-page__subtitle">Loading…</p></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flow-page dashboard-page">
      {/* Floating pastel shapes – decorative only */}
      <div className="dashboard-page__shapes" aria-hidden="true">
        <span className="dashboard-page__shape dashboard-page__shape--1" />
        <span className="dashboard-page__shape dashboard-page__shape--2" />
        <span className="dashboard-page__shape dashboard-page__shape--3" />
        <span className="dashboard-page__shape dashboard-page__shape--4" />
        <span className="dashboard-page__shape dashboard-page__shape--5" />
      </div>

      <div className="flow-page__card flow-page__card--fade dashboard-page__card">
        <h1 className="flow-page__title dashboard-page__title">
          Welcome, {name}
        </h1>
        <p className="flow-page__subtitle dashboard-page__subtitle">
          Your words matter. Create a wish and choose when it reaches someone you love.
        </p>
        <button
          type="button"
          className="flow-form__submit flow-form__submit--glow dashboard-page__cta"
          onClick={() => navigate('/dashboard')}
        >
          Create your first wish
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
