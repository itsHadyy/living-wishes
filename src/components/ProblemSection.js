function ProblemSection() {
  return (
    <section className="section problem" id="problem" aria-labelledby="problem-heading">
      <div className="section__inner animate-in">
        <h2 id="problem-heading" className="section__title">
          We all have things we wish we could say at the right moment.
        </h2>
        <p className="section__text">
          But life doesn&apos;t always give us that chance.
        </p>
        <ul className="problem__bullets">
          <li>Moments we might miss.</li>
          <li>Words we never said.</li>
          <li>Memories that fade with time.</li>
        </ul>
      </div>
    </section>
  );
}

export default ProblemSection;
