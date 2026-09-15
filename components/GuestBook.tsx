"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Review } from "@/lib/content";

type Attendance = "yes" | "maybe" | "no" | null;

export default function GuestBook({
  guestName,
  attendance,
}: {
  guestName: string;
  attendance?: Attendance;
}) {
  // Sourced entirely from data/guestbook.json (real guest submissions) — no
  // hardcoded placeholder messages.
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setReviews(data?.reviews ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    const entry: Review = {
      name: guestName,
      message: message.trim(),
      rating,
      ...(attendance ? { attendance } : {}),
    };
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch {
      // Best-effort — the message still shows locally below.
    }
    setReviews((prev) => [entry, ...prev]);
    setMessage("");
    setSubmitting(false);
    setPosted(true);
  }

  return (
    <section id="reviews" className="w-full bg-black px-5 py-14">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-white">What People Are Saying</h2>
      <p className="mb-6 text-sm text-nk-mist">Reviews from the people who know us best.</p>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-nk-panel p-4">
        <p className="mb-2 text-sm text-white/80">Leave a message, {guestName}</p>
        {attendance && (
          <p className="mb-3 text-xs text-nk-mist">
            This message will be noted with your RSVP: <AttendanceBadge status={attendance} />
          </p>
        )}
        <div className="mb-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)} className="text-xl" aria-label={`${n} star`}>
              <span className={n <= rating ? "text-nk-red" : "text-white/20"}>★</span>
            </button>
          ))}
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          rows={3}
          placeholder="Share your wishes..."
          className="mb-3 w-full resize-none rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-nk-red"
        />
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="w-full rounded bg-nk-red py-2.5 text-sm font-bold text-white disabled:opacity-30 active:scale-[0.98] transition-transform"
        >
          {submitting ? "Posting..." : "Post Message"}
        </button>
        {posted && <p className="mt-2 text-center text-xs text-nk-mist">Thanks for the review!</p>}
      </form>

      <div className="flex flex-col gap-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-lg bg-nk-panel/60 p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{r.name}</p>
                {r.attendance && <AttendanceBadge status={r.attendance} />}
              </div>
              <div className="flex flex-shrink-0 text-xs">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={idx < r.rating ? "text-nk-red" : "text-white/20"}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            {r.relation && <p className="mb-1 text-[11px] uppercase tracking-wider text-nk-mist">{r.relation}</p>}
            <p className="text-sm text-white/80">{r.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AttendanceBadge({ status }: { status: "yes" | "maybe" | "no" }) {
  const style =
    status === "yes"
      ? "bg-nk-red/20 text-nk-red"
      : status === "maybe"
        ? "bg-white/10 text-white/60"
        : "bg-white/5 text-white/40";
  const label = status === "yes" ? "Attending" : status === "maybe" ? "Maybe" : "Can't Attend";

  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${style}`}>
      {status === "yes" && "✓ "}
      {label}
    </span>
  );
}
