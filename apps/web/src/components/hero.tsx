const HERO_VIDEO_SRC = "/videos/hero-video.mp4";
const HERO_PLACEHOLDER_SRC = "/images/hero-placeholder.png";

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
        {/* Static fallback — visible while the video loads or if it fails */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={HERO_PLACEHOLDER_SRC}
        />
        <video
          autoPlay
          className="absolute inset-0 size-full object-cover"
          loop
          muted
          playsInline
          poster={HERO_PLACEHOLDER_SRC}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-start justify-end px-8 pb-16 text-left sm:px-16 md:items-center md:justify-center md:text-center">
        <div className="flex w-full flex-col items-start gap-4 md:items-center md:gap-8">
          <h1 className="type-hero bg-gradient-to-b from-white/55 via-white/90 to-white bg-clip-text font-semibold capitalize tracking-tight text-transparent">
            Jouw vakkennis.
            <br />
            Ons systeem.
            <br />
            Eén product.
          </h1>
          <p className="type-hero-lead font-medium text-white/70">
            Verticale software voor dossierwerk. Elk product gebouwd met een
            domeinpartner.
          </p>
        </div>
      </div>
    </section>
  );
}
