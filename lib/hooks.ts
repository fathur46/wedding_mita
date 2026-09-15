"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is (mostly) within the viewport.
 * Used to autoplay/pause the trailer video and to trigger scroll-reveal.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
};

/** Countdown to the wedding date. Flips to "isLive" once the date has passed. */
export function useCountdown(targetISO: string): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => computeCountdown(targetISO));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(computeCountdown(targetISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  return countdown;
}

function computeCountdown(targetISO: string): Countdown {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isLive: false };
}
