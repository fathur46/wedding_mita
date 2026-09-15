"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { weddingConfig } from "@/lib/content";

// Tuned to public/intro.mp3 (~4.06s): a brief silent beat before the logo
// lands (letting the sound build up first), then holding the logo through
// the rest of the sound plus a short buffer before moving on.
const LOGO_DELAY = 0.6;
const TOTAL_DURATION_MS = 4400;

/** Short Netflix "ta-dum"-style brand beat between profile select and the app. */
export default function BrandIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.4, delay: LOGO_DELAY, times: [0, 0.5, 1] }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-40 w-40 rounded-full bg-nk-red/60 blur-3xl" />
      </motion.div>

      {/*
       * layoutId shared with the small logo in TopNav — when this component
       * unmounts as the phase flips to "app" and TopNav's logo mounts in its
       * place, Framer Motion morphs between the two positions/sizes instead
       * of a hard cut, so the title appears to fly into the header corner.
       */}
      <motion.h1
        layoutId="brand-logo"
        initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: LOGO_DELAY, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-5xl sm:text-6xl tracking-wide text-nk-red"
      >
        {weddingConfig.brand}
      </motion.h1>
    </div>
  );
}
