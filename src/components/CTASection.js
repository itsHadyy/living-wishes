function CTASection() {
  return (
    <section className="cta" id="cta" aria-labelledby="cta-heading">
      <div className="cta__inner animate-in">
        <h2 id="cta-heading" className="cta__title">
          Some words shouldn&apos;t be lost.
        </h2>
        <div className="cta__buttons">
          <a href="#how-it-works" className="cta__btn cta__btn--primary">
            Start Your First Wish
          </a>
          <a href="#how-it-works" className="cta__btn cta__btn--secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
