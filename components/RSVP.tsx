"use client";

import { useEffect, useState } from "react";

type Status = "yes" | "maybe" | "no";

const options: { value: Status; label: string }[] = [
  { value: "yes", label: "YES, I'LL BE THERE" },
  { value: "maybe", label: "MAYBE" },
  { value: "no", label: "SORRY, I CAN'T MAKE IT" },
];

export default function RSVP({
  guestName,
  onStatusChange,
}: {
  guestName: string;
  onStatusChange?: (status: Status) => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (typeof data?.confirmedGuests === "number") setConfirmedCount(data.confirmedGuests);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    if (!status) return;
    setSubmitting(true);
    const count = status === "yes" ? guestCount : 1;
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, status, guestCount: count }),
      });
    } catch {
      // Best-effort — still confirm locally so a network hiccup doesn't block the guest.
    } finally {
      setSubmitting(false);
      setDone(true);
      onStatusChange?.(status);
      if (status === "yes") {
        setConfirmedCount((prev) => (prev ?? 0) + count);
      }
    }
  }

  const headcount = confirmedCount !== null && confirmedCount > 0 && (
    <div className="mb-6 rounded-md bg-nk-panel px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-nk-red">Confirmed Guests</p>
      <p className="font-display text-2xl text-white">
        {confirmedCount} <span className="font-body text-sm font-normal normal-case text-nk-mist">people will be there</span>
      </p>
    </div>
  );

  if (done) {
    return (
      <section id="rsvp" className="w-full bg-black px-5 py-14 text-center">
        <div className="mx-auto max-w-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-nk-red">
            <CheckIcon />
          </div>
          <h2 className="mb-2 font-display text-2xl text-white">You&apos;re on the list</h2>
          <p className="mb-6 text-sm text-nk-mist">Thanks, {guestName}. We&apos;ll see you at the premiere.</p>
          {headcount}
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="w-full bg-black px-5 py-14">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-white">Are You Watching?</h2>
      <p className="mb-6 text-sm text-nk-mist">We&apos;d love to have you with us on this special day.</p>

      {headcount}

      <p className="mb-4 text-sm text-white/70">
        RSVP as <span className="font-semibold text-white">{guestName}</span>
      </p>

      <div className="mb-5 flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`rounded-md border px-4 py-3 text-left text-sm font-semibold tracking-wide transition-colors ${
              status === opt.value
                ? "border-nk-red bg-nk-red/15 text-white"
                : "border-white/10 bg-nk-panel text-white/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {status === "yes" && (
        <div className="mb-6 flex items-center justify-between rounded-md bg-nk-panel px-4 py-3">
          <span className="text-sm text-white/80">Number of guests</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
              className="h-7 w-7 rounded bg-white/10 text-white"
              aria-label="Decrease"
            >
              -
            </button>
            <span className="w-4 text-center text-white">{guestCount}</span>
            <button
              onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
              className="h-7 w-7 rounded bg-white/10 text-white"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!status || submitting}
        className="w-full rounded bg-nk-red py-3 text-sm font-bold tracking-wide text-white disabled:opacity-30 active:scale-[0.98] transition-transform"
      >
        {submitting ? "Sending..." : "Confirm RSVP"}
      </button>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
