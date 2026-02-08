function SolutionSection() {
  const features = [
    { title: 'Write messages', description: 'Put your thoughts into words they can keep.' },
    { title: 'Record voice and video', description: 'Your voice and face, saved for the right moment.' },
    { title: 'Choose future moments', description: 'Birthdays, milestones, or a date you decide.' },
    { title: 'Protect with privacy', description: 'Trusted contacts and control over who sees what.' },
  ];

  return (
    <section className="section solution" id="solution" aria-labelledby="solution-heading">
      <div className="section__inner animate-in">
        <h2 id="solution-heading" className="section__title">
          A private digital space for what matters
        </h2>
        <p className="section__text">
          Living Wishes is a private digital space where your words, voice, and memories can reach the people you love — exactly when they need them.
        </p>
        <div className="solution__grid">
          {features.map((item) => (
            <article key={item.title} className="solution__card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
