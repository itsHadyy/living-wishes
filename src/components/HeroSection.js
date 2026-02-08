function HeroSection() {
  return (
    <section className="hero" id="hero">
      <h1 className="hero__headline">Messages that live beyond time.</h1>
      <p className="hero__subheadline">
        Living Wishes lets you create messages, videos, and memories for the people you love — delivered at the moments that matter most.
      </p>
      <div className="hero__ctas">
        <a href="#how-it-works" className="hero__btn hero__btn--primary">
          Create a Wish
        </a>
        <a href="#how-it-works" className="hero__btn hero__btn--secondary">
          How it Works
        </a>
      </div>
      <div className="hero__timeline" aria-hidden="true" />
    </section>
  );
}

export default HeroSection;
