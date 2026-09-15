"use client";

import { motion } from "framer-motion";
import MediaFrame from "./MediaFrame";
import { weddingConfig } from "@/lib/content";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero({ guestName }: { guestName: string }) {
  return (
    <section className="relative flex h-[100svh] w-full flex-col justify-end overflow-hidden">
      <MediaFrame
        src={weddingConfig.heroImage}
        alt={weddingConfig.coupleTitle}
        label={weddingConfig.coupleTitle}
        monogram
        priority
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-fade-edges" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-5 pb-[calc(2.5rem+var(--inset-bottom))]"
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-nk-red">
          {weddingConfig.tag}
        </p>

        <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] sm:text-6xl">
          {weddingConfig.coupleTitle}
        </h1>

        <p className="mt-3 text-[13px] font-medium tracking-wide text-nk-mist">{weddingConfig.heroMeta}</p>

        <p className="mt-3 max-w-sm text-[15px] italic text-white/90">&ldquo;{weddingConfig.heroTagline}&rdquo;</p>
        <p className="mt-1 max-w-sm text-sm text-nk-mist">{weddingConfig.heroLogline}</p>

        <p className="mt-4 text-sm text-white/70">
          Welcome, <span className="text-white">{guestName}</span>.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => scrollTo("trailer")}
            className="flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-bold text-black active:scale-[0.97] transition-transform"
          >
            <PlayIcon /> Play Trailer
          </button>
          <button
            onClick={() => scrollTo("story")}
            className="flex items-center gap-2 rounded bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm active:scale-[0.97] transition-transform"
          >
            <InfoIcon /> Our Story
          </button>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 animate-pulseRed">
        <ChevronDown />
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
