function CTASection() {
  return (
    <section className="cta" id="cta" aria-labelledby="cta-heading">
      <div className="cta__inner animate-in">
        <h2 id="cta-heading" className="cta__title">
          Some words shouldn&apos;t disappear.
        </h2>
        <div className="cta__buttons">
          <a href="#how-it-works" className="cta__btn cta__btn--primary">
            Start your first wish
          </a>
          <a href="#how-it-works" className="cta__btn cta__btn--secondary">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
