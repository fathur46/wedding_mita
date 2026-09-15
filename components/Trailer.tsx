"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";
import MediaFrame from "./MediaFrame";
import { weddingConfig } from "@/lib/content";

export default function Trailer() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || errored) return;
    // Once the guest has turned sound on, keep it playing even after they
    // scroll away — pausing an unmuted video the moment they scroll would
    // feel like their action got ignored. Muted playback still pauses
    // off-screen to save battery/data, matching the autoplay-preview intent.
    if (inView || !muted) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, errored, muted]);

  return (
    <section id="trailer" ref={ref} className="relative w-full bg-black px-5 py-10">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-nk-red">
        {weddingConfig.trailerTitle}
      </p>
      <p className="mb-4 text-sm text-nk-mist">{weddingConfig.trailerLogline}</p>

      <div className="relative aspect-[9/16] max-h-[70vh] w-full overflow-hidden rounded-lg bg-nk-panel">
        {!errored ? (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="block h-full w-full"
            aria-label={muted ? "Unmute trailer" : "Mute trailer"}
          >
            <video
              ref={videoRef}
              src={weddingConfig.trailerVideo}
              poster={weddingConfig.trailerPoster}
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setErrored(true)}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <MediaFrame
            src={weddingConfig.trailerPoster}
            alt={weddingConfig.trailerTitle}
            label="Trailer coming soon"
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {!errored && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm active:scale-95 transition-transform"
          >
            {muted ? (
              <>
                <SpeakerMutedIcon /> Muted
              </>
            ) : (
              <>
                <SpeakerIcon /> Sound On
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 8v1.79l2.48 2.48c.01-.09.02-.18.02-.27zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
