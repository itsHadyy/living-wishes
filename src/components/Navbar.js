import { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo">
          Living Wishes
        </a>
        <ul className="navbar__links">
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#privacy">Privacy</a></li>
          <li><a href="#cta" className="navbar__cta">Create a Wish</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
