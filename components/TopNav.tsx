"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MediaFrame from "./MediaFrame";
import { weddingConfig } from "@/lib/content";

export default function TopNav({ guestName }: { guestName: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3.5 pt-[calc(0.875rem+var(--inset-top))] transition-colors duration-300 ${
        scrolled ? "bg-black/95 shadow-lg shadow-black/50" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <motion.span
        layoutId="brand-logo"
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-2xl leading-none tracking-wide text-nk-red"
      >
        {weddingConfig.brand}
      </motion.span>
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
        <MediaFrame
          src="/images/profile.jpg"
          alt={guestName}
          label={guestName.charAt(0).toUpperCase()}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      </span>
    </header>
  );
}
