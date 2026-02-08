function PrivacySection() {
  const points = [
    'End-to-end encryption',
    'You control access',
    'Trusted contacts system',
    'Data protection',
  ];

  return (
    <section className="section privacy" id="privacy" aria-labelledby="privacy-heading">
      <div className="section__inner animate-in">
        <h2 id="privacy-heading" className="section__title">
          Your memories are private. Your wishes are secure.
        </h2>
        <p className="section__text">
          We take security seriously. Your data is protected so only the right people see it, at the right time.
        </p>
        <ul className="privacy__points">
          {points.map((point) => (
            <li key={point} className="privacy__point">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PrivacySection;
