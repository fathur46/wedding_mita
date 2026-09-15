"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MediaFrame from "./MediaFrame";
import { weddingConfig } from "@/lib/content";

export default function ProfileGate({
  initialName,
  onEnter,
}: {
  initialName?: string;
  onEnter: (name: string) => void;
}) {
  const [stage, setStage] = useState<"name" | "select">(initialName ? "select" : "name");
  const [typedName, setTypedName] = useState("");

  const displayName = initialName || typedName || "Guest";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-nk-redDim/70 via-nk-redDim/15 to-transparent" />

      <AnimatePresence>
        {stage === "name" ? (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full max-w-xs text-center"
          >
            <h1 className="font-display text-3xl tracking-wide text-white mb-2">
              What&apos;s your name?
            </h1>
            <p className="text-sm text-nk-mist mb-6">So we know who&apos;s watching.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (typedName.trim().length > 0) setStage("select");
              }}
              className="flex flex-col gap-3"
            >
              <input
                autoFocus
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Your name"
                maxLength={40}
                className="w-full rounded bg-nk-panel2 border border-white/10 px-4 py-3 text-center text-white placeholder-white/30 outline-none focus:border-nk-red transition-colors"
              />
              <button
                type="submit"
                disabled={typedName.trim().length === 0}
                className="w-full rounded bg-nk-red py-3 font-semibold tracking-wide text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                Continue
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="font-display text-3xl tracking-wide text-white mb-10">
              Who&apos;s Watching?
            </h1>
            <button onClick={() => onEnter(displayName)} className="group flex flex-col items-center gap-2">
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ delay: 0.6, duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}
                className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50"
              >
                ↓ Click here
              </motion.span>
              <span className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-md ring-2 ring-transparent group-hover:ring-white group-active:ring-nk-red transition-all">
                <MediaFrame
                  src="/images/profile.jpg"
                  alt={displayName}
                  label={initials(displayName)}
                  priority
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </span>
              <span className="text-base sm:text-lg text-nk-mist group-hover:text-white transition-colors tracking-wide">
                {displayName}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-white/25">
        {weddingConfig.brand}
      </p>
    </div>
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
