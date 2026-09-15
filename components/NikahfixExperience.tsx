"use client";

import { useCallback, useState } from "react";
import ProfileGate from "./ProfileGate";
import BrandIntro from "./BrandIntro";
import TopNav from "./TopNav";
import Hero from "./Hero";
import Trailer from "./Trailer";
import OurStory from "./OurStory";
import Cast from "./Cast";
import NextEpisode from "./NextEpisode";
import Memories from "./Memories";
import RSVP from "./RSVP";
import GuestBook from "./GuestBook";
import Location from "./Location";
import GiftSection from "./GiftSection";
import Credits from "./Credits";
import { slugifyName } from "@/lib/slug";

type Phase = "gate" | "intro" | "app";

type AttendanceStatus = "yes" | "maybe" | "no";

export default function NikahfixExperience({ initialName }: { initialName?: string }) {
  const [phase, setPhase] = useState<Phase>("gate");
  const [guestName, setGuestName] = useState<string | null>(initialName ?? null);
  // Set once the guest RSVPs in this visit, so a Guest Book message they
  // leave afterwards can carry a "confirmed attendance" note.
  const [attendance, setAttendance] = useState<AttendanceStatus | null>(null);

  const handleEnter = useCallback(
    (name: string) => {
      setGuestName(name);
      if (!initialName) {
        // Update the address bar to the personalized URL without triggering a
        // route change — a real Next.js navigation would remount this page
        // and drop us back at the profile-select screen.
        const slug = slugifyName(name);
        if (slug) window.history.replaceState(null, "", `/to/${slug}`);
      }
      // Played synchronously inside this click-triggered callback so the
      // browser's autoplay policy treats it as a direct result of the
      // user's gesture.
      const sound = new Audio("/intro.mp3");
      sound.volume = 0.7;
      sound.play().catch(() => {});
      setPhase("intro");
    },
    [initialName]
  );

  if (phase === "gate") {
    return <ProfileGate initialName={initialName} onEnter={handleEnter} />;
  }

  if (phase === "intro") {
    return <BrandIntro onDone={() => setPhase("app")} />;
  }

  const name = guestName ?? "Guest";

  return (
    <main className="relative min-h-screen w-full bg-black">
      <TopNav guestName={name} />
      <Hero guestName={name} />
      <Trailer />
      <OurStory />
      <Cast />
      <NextEpisode />
      <Memories />
      <RSVP guestName={name} onStatusChange={setAttendance} />
      <GuestBook guestName={name} attendance={attendance} />
      <Location />
      <GiftSection />
      <Credits />
    </main>
  );
}
