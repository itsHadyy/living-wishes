import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const isFlowPage = ['/signup', '/login', '/complete-profile', '/dashboard'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Living Wishes
        </Link>
        <ul className="navbar__links">
          {!isFlowPage && (
            <>
              <li><a href="/#how-it-works">How it Works</a></li>
              <li><a href="/#privacy">Privacy</a></li>
            </>
          )}
          {!loading && (
            user ? (
              <>
                <li className="navbar__user">
                  <span className="navbar__user-email" title={user.email}>
                    {user.email}
                  </span>
                  <button type="button" className="navbar__user-btn" onClick={logout}>
                    Log out
                  </button>
                </li>
                <li>
                  <Link to="/dashboard" className="navbar__cta">Dashboard</Link>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="navbar__links-link">Log in</Link></li>
                <li><Link to="/signup" className="navbar__cta">Sign up</Link></li>
              </>
            )
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
