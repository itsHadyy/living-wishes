function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Create a wish',
      description: 'Write a message or record a video for someone you love.',
    },
    {
      num: 2,
      title: 'Choose the moment',
      description: 'Select a date or life event (birthday, graduation, wedding, or beyond).',
    },
    {
      num: 3,
      title: 'Secure it',
      description: 'Assign trusted contacts and privacy settings.',
    },
    {
      num: 4,
      title: 'Deliver it',
      description: 'Your message is revealed at the right time.',
    },
  ];

  return (
    <section className="section how" id="how-it-works" aria-labelledby="how-heading">
      <div className="section__inner animate-in">
        <h2 id="how-heading" className="section__title">
          How it works
        </h2>
        <p className="section__text">
          Four simple steps to leave words that last.
        </p>
        <ol className="how__steps">
          {steps.map((step) => (
            <li key={step.num} className="how__step">
              <div className="how__step-num" aria-hidden="true">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
