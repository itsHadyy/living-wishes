function UseCases() {
  const cases = [
    { title: 'For your child', description: 'Words they\'ll hear when they grow up.', accent: 'purple' },
    { title: 'For your partner', description: 'Things you want them to remember.', accent: 'pink' },
    { title: 'For your parents', description: 'Gratitude that lasts.', accent: 'blue' },
    { title: 'For your future self', description: 'Messages to the person you\'ll become.', accent: 'purple-2' },
  ];

  return (
    <section className="section use-cases" id="use-cases" aria-labelledby="use-cases-heading">
      <div className="section__inner animate-in">
        <h2 id="use-cases-heading" className="section__title">
          Who it&apos;s for
        </h2>
        <p className="section__text">
          For the people who matter most — and for the moments that will.
        </p>
        <div className="use-cases__grid">
          {cases.map((item) => (
            <article key={item.title} className={`use-cases__card use-cases__card--${item.accent}`}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCases;
