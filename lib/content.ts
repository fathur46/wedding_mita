// ---------------------------------------------------------------------------
// NIKAHFIX content config
// Edit everything here to re-skin the invitation with your own wedding data.
// No component files need to change when you update this file.
// ---------------------------------------------------------------------------

export type Episode = {
  number: string;
  title: string;
  subtitle: string;
  year: string;
  image: string;
  description: string;
};

export type CastMember = {
  name: string;
  role: string;
  image: string;
};

export type GalleryItem = {
  id: string;
  category: string;
  image: string;
  caption?: string;
};

export type Review = {
  name: string;
  relation?: string;
  message: string;
  rating: number; // 1-5
  /** Set when the guest also RSVP'd in the same visit — shown as a small badge. */
  attendance?: "yes" | "maybe" | "no";
};

export type GiftAccount = {
  owner: string; // e.g. "Andini (Bride)"
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export const weddingConfig = {
  // Brand
  brand: "NIKAHFIX",
  tag: "NIKAHFIX ORIGINAL",

  // The couple
  groomName: "Alvin",
  brideName: "Mifta",
  coupleTitle: "ALVIN & MIFTA",

  // Hero
  heroImage: "/images/hero.jpg",
  heroMeta: "2026 • Romance • Wedding • True Story",
  heroTagline: "Two people. One story. A lifetime to go.",
  heroLogline:
    "From a chance meeting to forever — watch how it all began, and where it's headed next.",

  // Trailer
  trailerVideo: "/videos/trailer.mp4",
  trailerPoster: "/images/trailer-poster.jpg",
  trailerTitle: "Our Story",
  trailerLogline: "The official trailer for the story of us.",

  // Wedding date/time (ISO with offset, used for countdown)
  weddingDateISO: "2026-12-20T09:00:00+07:00",
  weddingDateLabel: "Saturday, 20 December 2026",

  ceremony: {
    label: "AKAD NIKAH",
    date: "Monday, 26 October 2026",
    time: "08:30 WIB",
    startISO: "2026-12-20T08:30:00+07:00",
    endISO: "2026-12-20T09:00:00+07:00",
    venueName: "Cafe DKenyoet Sumberbaru",
    venueAddress: "Jl. Empat Lima, Krajan Kidul, Yosorati, Kec. Sumberbaru, Jember",
    mapsUrl: "https://maps.app.goo.gl/J9UrXFdWCM55SQys6",
  },
  reception: {
    label: "RECEPTION",
    date: "Monday, 26 October 2026",
    time: "09:00 WIB",
    startISO: "2026-12-20T09:00:00+07:00",
    endISO: "2026-12-20T14:00:00+07:00",
    venueName: "Cafe DKenyoet Sumberbaru",
    venueAddress: "Jl. Empat Lima, Krajan Kidul, Yosorati, Kec. Sumberbaru, Jember",
    mapsUrl: "https://maps.app.goo.gl/J9UrXFdWCM55SQys6",
  },

  // Our Story — Netflix-style episodes
  episodes: [
    {
      number: "01",
      title: "The First Meeting",
      subtitle: "Pilot",
      year: "2025",
      image: "/images/episode-1.png",
      description:
        "A crowded room, an accidental introduction, and a conversation neither of them wanted to end.",
    },
    {
      number: "02",
      title: "The Journey",
      subtitle: "Season One",
      year: "2025 — 2026",
      image: "/images/episode-2.png",
      description:
        "Long calls, longer distances, and the slow realization that this was the real thing.",
    },
    // {
    //   number: "03",
    //   title: "The Proposal",
    //   subtitle: "Season Finale",
    //   year: "2025",
    //   image: "/images/episode-3.jpg",
    //   description: "One knee, one question, one very shaky 'yes'.",
    // },
    {
      number: "03",
      title: "Forever",
      subtitle: "Coming Soon",
      year: "2026",
      image: "/images/episode-3.png",
      description:
        "The wedding. The beginning of a story with no ending — just the next chapter.",
    },
  ] satisfies Episode[],

  // The Cast
  mainCast: {
    bride: { name: "Mifta", role: "The Bride", image: "/images/bride.jpg" },
    groom: { name: "Alvin", role: "The Groom", image: "/images/groom.jpg" },
  },
  specialAppearances: [
    { name: "Bpk. Ahmad", role: "Father of the Bride", image: "/images/cast-1.jpg" },
    { name: "Ibu Sumaidah", role: "Mother of the Bride", image: "/images/cast-2.jpg" },
    { name: "Bpk. Joko", role: "Father of the Groom", image: "/images/cast-3.jpg" },
    { name: "Ibu Rina", role: "Mother of the Groom", image: "/images/cast-4.jpg" },
  ] satisfies CastMember[],

  // Send a Gift — bank account details. Leave the array empty to hide the
  // whole section.
  giftNote: "Your presence is the greatest gift. If you'd like to send something more, here's where.",
  giftAccounts: [
    { owner: "Mifta (Bride)", bankName: "BRI", accountNumber: "1234567890", accountHolder: "Siti Miftahul Jannah" },
    { owner: "Alvin (Groom)", bankName: "Mandiri", accountNumber: "0987654321", accountHolder: "Alvin Subagyo" },
  ] satisfies GiftAccount[],

  // Memories / Gallery
  gallery: [
    { id: "g1", category: "Our Journey", image: "/images/journey1.png" },
    { id: "g2", category: "Our Journey", image: "/images/journey2.png" },
    { id: "g3", category: "Once Upon Us", image: "/images/once3.png" },
    { id: "g4", category: "Once Upon Us", image: "/images/once4.png" },
    // { id: "g5", category: "Our Journey", image: "/images/gallery-5.jpg" },
    // { id: "g6", category: "Friends", image: "/images/gallery-6.jpg" },
    // { id: "g7", category: "Pre-Wedding", image: "/images/gallery-7.jpg" },
    // { id: "g8", category: "Family", image: "/images/gallery-8.jpg" },
  ] satisfies GalleryItem[],

  // Guest Book messages are read entirely from data/guestbook.json (real
  // guest submissions) at runtime — see components/GuestBook.tsx. Nothing
  // here is displayed; this type export just documents the shape.
  reviews: [] satisfies Review[],
};

export type WeddingConfig = typeof weddingConfig;
