function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <a href="#hero" className="footer__brand">
            Living Wishes
          </a>
          <p className="footer__tagline">
            Messages that live beyond time.
          </p>
        </div>
        <ul className="footer__links">
          <li><a href="#solution">About</a></li>
          <li><a href="#privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <p className="footer__copy">
        &copy; {year} Living Wishes. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
