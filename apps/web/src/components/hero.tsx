const HERO_VIDEO_SRC = "/videos/hero.mp4";
const HERO_POSTER_SRC = "/images/hero-poster.jpg";

export default function Hero() {
  return (
    <section
      id="top"
      data-progress-nav-anchor
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <video
          autoPlay
          className="absolute inset-0 size-full object-cover"
          loop
          muted
          playsInline
          poster={HERO_POSTER_SRC}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-16 pb-16 text-center">
        <div className="flex w-full flex-col items-center gap-8">
          <h1 className="bg-gradient-to-b from-white/55 via-white/90 to-white bg-clip-text text-5xl font-semibold leading-[1.08] capitalize tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-[4.75rem]">
            Jouw vakkennis.
            <br />
            Ons systeem.
            <br />
            Eén product.
          </h1>
          <p className="text-base font-medium leading-relaxed text-white/70 md:text-lg">
            Verticale software voor dossierwerk. Elk product gebouwd met een domeinpartner.
          </p>
        </div>
      </div>
    </section>
  );
}
