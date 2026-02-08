import { useState, useEffect } from 'react';

const HEADLINE = 'Messages that live beyond time.';
const TYPE_SPEED = 120;
const START_DELAY = 400;

function HeroSection() {
  const [visibleLength, setVisibleLength] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisibleLength(HEADLINE.length);
      return;
    }

    const startTimer = setTimeout(() => setStarted(true), START_DELAY);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;

    if (visibleLength >= HEADLINE.length) return;

    const id = setInterval(() => {
      setVisibleLength((prev) => {
        if (prev >= HEADLINE.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, TYPE_SPEED);

    return () => clearInterval(id);
  }, [started, visibleLength]);

  const visibleText = HEADLINE.slice(0, visibleLength);
  const isComplete = visibleLength >= HEADLINE.length;

  return (
    <section className="hero" id="hero">
      <h1 className="hero__headline" aria-label={HEADLINE}>
        {visibleText}
        {!isComplete && <span className="hero__cursor" aria-hidden="true" />}
      </h1>
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
