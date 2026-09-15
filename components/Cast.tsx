"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MediaFrame from "./MediaFrame";
import { weddingConfig, type CastMember } from "@/lib/content";

export default function Cast() {
  const { bride, groom } = weddingConfig.mainCast;
  const allCast: CastMember[] = [bride, groom, ...weddingConfig.specialAppearances];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="cast" className="w-full bg-black px-5 py-12">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-white">The Cast</h2>
      <p className="mb-6 text-sm text-nk-mist">Main Cast</p>

      <div className="grid grid-cols-2 gap-4">
        {[bride, groom].map((person, i) => (
          <motion.button
            key={person.name}
            type="button"
            onClick={() => setActiveIndex(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-lg bg-nk-panel text-left active:scale-[0.98] transition-transform"
          >
            <div className="relative aspect-[3/4] w-full">
              <MediaFrame
                src={person.image}
                alt={person.name}
                label={person.name}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[10px] uppercase tracking-wider text-nk-red">{person.role}</p>
                <p className="font-display text-xl text-white">{person.name}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {weddingConfig.specialAppearances.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-white">Special Appearances</p>
          <div className="edge-fade -mx-5 flex gap-4 overflow-x-auto px-5 hide-scrollbar">
            {weddingConfig.specialAppearances.map((person, i) => (
              <button
                type="button"
                key={person.name}
                onClick={() => setActiveIndex(2 + i)}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-2 text-center active:scale-95 transition-transform"
              >
                <span className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/10">
                  <MediaFrame
                    src={person.image}
                    alt={person.name}
                    label={initials(person.name)}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </span>
                <span className="text-[11px] leading-tight text-white/90">{person.name}</span>
                <span className="text-[10px] leading-tight text-nk-mist">{person.role}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeIndex !== null && (
          <CastLightbox
            cast={allCast}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onIndexChange={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Deliberately styled unlike the Memories lightbox (full-bleed cover photo
 * with a credit-style name/role caption baked into the image) so Cast feels
 * like a movie credits card rather than a plain photo viewer.
 */
function CastLightbox({
  cast,
  index,
  onClose,
  onIndexChange,
}: {
  cast: CastMember[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const person = cast[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-[calc(1rem+var(--inset-top))] z-10 px-2 text-2xl leading-none text-white/80"
        aria-label="Close"
      >
        &times;
      </button>

      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <MediaFrame
          src={person.image}
          alt={person.name}
          label={person.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-nk-red">
            {index < 2 ? "Main Cast" : "Special Appearance"}
          </p>
          <h3 className="font-display text-4xl text-white">{person.name}</h3>
          <p className="mt-1 text-sm text-white/70">as {person.role}</p>
        </div>

        {index > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index - 1);
            }}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="Previous"
          >
            &#8249;
          </button>
        )}
        {index < cast.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index + 1);
            }}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="Next"
          >
            &#8250;
          </button>
        )}
      </div>

      <p className="pb-[calc(1.5rem+var(--inset-bottom))] pt-3 text-center text-xs text-white/40">
        CAST {index + 1} / {cast.length}
      </p>
    </motion.div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
