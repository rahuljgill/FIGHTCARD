function About() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-body">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-purple">
          About
        </h1>

        <section className="mt-8">
          <h2 className="text-xl font-bold uppercase text-white">
            Boxing, made simple.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            This site is built for boxing fans who want a quick and enjoyable
            way to keep up with the fights that matter.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Browse upcoming fight cards, explore fighter records and stats, and
            see who's stepping into the ring next. All presented with a fun,
            video-game-inspired aesthetic.
          </p>
        </section>

        <section className="mt-10 border-t border-purple/20 pt-8">
          <h2 className="text-lg uppercase tracking-widest text-purple">
            Make Your Pick
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase text-white">
            Think you know who's going to win?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Every featured fight has a prediction poll where you can cast your
            vote and see what the community thinks. Will the favourite take it,
            or is an upset coming?
          </p>
        </section>

        <section className="mt-10 border-t border-purple/20 pt-8">
          <h2 className="text-lg uppercase tracking-widest text-purple">
            Join the Discussion
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Every fight has its own discussion section where users can share
            their thoughts, predictions and opinions before and after the
            opening bell.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Whether you're breaking down a fighter's chances, debating a
            potential upset or simply supporting your favourite boxer, the
            discussion is yours.
          </p>
        </section>

        <section className="mt-10 rounded-md border border-purple/30 bg-[#0a0d1c] p-6">
          <h2 className="text-sm uppercase tracking-widest text-purple">
            A Note About the Data
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-text">
            This website is an independent fan-made project and is not
            affiliated with, endorsed by, or sponsored by any boxer, promoter,
            governing body, broadcaster or boxing organisation.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text">
            Fighter and fight information is presented for informational and
            entertainment purposes. While we aim to keep the information
            accurate and up to date, details such as fight dates, records and
            event information may change or contain errors.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text">
            Fighter names, event names and other third-party trademarks remain
            the property of their respective owners.
          </p>
        </section>

        <div className="mt-12 text-center">
          <h2 className="font-heading text-2xl uppercase tracking-widest text-purple">
            Boxing is the Main Event.
          </h2>
          <p className="mt-2 text-sm uppercase tracking-wide text-white">
            Explore the cards. Make your prediction. Join the discussion.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
