"use client";

import { weddingConfig } from "@/lib/content";

export default function Location() {
  const venue = weddingConfig.reception;
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${venue.venueName}, ${venue.venueAddress}`
  )}&output=embed`;

  return (
    <section id="location" className="w-full bg-black px-5 py-14">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-white">Where to Watch</h2>
      <p className="mb-6 text-sm text-nk-mist">
        {venue.date} &middot; {venue.time}
      </p>

      <div className="mb-4 overflow-hidden rounded-lg border border-white/10">
        <iframe
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-48 w-full"
          style={{ filter: "invert(0.9) hue-rotate(180deg) contrast(0.9) brightness(0.9)" }}
          title="Venue map"
        />
      </div>

      <p className="mb-1 font-display text-xl text-white">{venue.venueName}</p>
      <p className="mb-4 text-sm text-nk-mist">{venue.venueAddress}</p>

      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded bg-nk-red py-3 text-center text-sm font-bold tracking-wide text-white active:scale-[0.98] transition-transform"
      >
        Open Maps
      </a>
    </section>
  );
}
