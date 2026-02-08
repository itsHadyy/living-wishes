function UseCases() {
  const cases = [
    {
      title: 'For Your Child',
      description: 'Words they\'ll hear when they grow up.',
    },
    {
      title: 'For Your Partner',
      description: 'Things you want them to remember.',
    },
    {
      title: 'For Your Parents',
      description: 'Gratitude that lasts.',
    },
    {
      title: 'For Yourself',
      description: 'Messages to your future self.',
    },
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
            <article key={item.title} className="use-cases__card">
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
