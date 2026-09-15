"use client";

import { useState } from "react";

/**
 * Renders a photo, or — if the file hasn't been supplied yet in /public —
 * a cinematic gradient placeholder so the layout still looks intentional.
 * Drop real files into /public/images matching the paths in lib/content.ts
 * and this swaps over automatically.
 */
export default function MediaFrame({
  src,
  alt,
  label,
  monogram = false,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  label?: string;
  /** Renders the label as a large faded monogram (for big hero-style frames) instead of a caption. */
  monogram?: boolean;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    const text = label ?? alt;
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-nk-panel2 via-nk-panel to-black ${className}`}
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.35),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0, transparent 2px, white 2px, white 3px)",
            backgroundSize: "6px 6px",
          }}
        />
        {monogram ? (
          <span className="relative z-10 select-none font-display text-6xl tracking-wide text-white/15 sm:text-7xl">
            {initials(text)}
          </span>
        ) : (
          <span className="relative z-10 px-4 text-center font-display text-lg tracking-wide text-white/60">
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setErrored(true)}
      className={`${className} ${imgClassName}`}
    />
  );
}

function initials(text: string) {
  const words = text.split(/[\s&]+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return text.slice(0, 2).toUpperCase();
}
