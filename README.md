# NIKAHFIX

A Netflix-style digital wedding invitation. Mobile-first, single-page, personalized per guest via URL.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (no name) or `http://localhost:3000/to/budi` (personalized for "Budi").

## The one file you need: `lib/content.ts`

Every piece of wedding content — names, dates, venues, episodes, cast, gallery photos — lives in [`lib/content.ts`](lib/content.ts). No component file needs to change for everyday edits; you're just editing a plain JavaScript object. (Guest Book messages are the one exception — see below.)

### Change names, dates, venue

Edit the top-level fields directly:

```ts
groomName: "Genos",
brideName: "Andini",
coupleTitle: "GENOS & ANDINI",
weddingDateISO: "2026-12-20T09:00:00+07:00", // drives the countdown
```

and the `ceremony` / `reception` objects (date, time, venue name/address, Google Maps link).

### Add a photo to a section (e.g. Pre-Wedding)

The **Memories** gallery is one flat list — each item just declares which category it belongs to. To add a new Pre-Wedding photo:

1. Drop the image file into `public/images/`, e.g. `gallery-9.jpg`.
2. Add an entry to the `gallery` array in `lib/content.ts`:

   ```ts
   gallery: [
     // ...existing items
     { id: "g9", category: "Pre-Wedding", image: "/images/gallery-9.jpg" },
   ],
   ```

`id` just needs to be unique across the array — it's not shown anywhere. `category` is the row label the guest sees ("Pre-Wedding", "Our Journey", "Family", "Friends", or any name you invent).

### Remove a photo from a section

Delete its object from the `gallery` array (and optionally delete the now-unused file from `public/images/`). Nothing else needs updating.

### Sections auto-hide when empty

If you delete every photo in a given category (say every "Friends" item), that entire row — including its label — disappears from the page automatically; you don't need to hide it manually. The same applies to:

- **Memories** as a whole: if the `gallery` array is completely empty, the whole "Memories / Watch Again" section is skipped.
- **Special Appearances** under The Cast: if `specialAppearances` is an empty array, that block doesn't render.

This means you can safely delete placeholder entries you don't need instead of leaving empty sections behind.

### Add/remove Our Story episodes

Same idea — `episodes` is an ordered array. Add an object (`number`, `title`, `subtitle`, `year`, `image`, `description`) to add an episode card, or delete one to remove it. Numbering is just a display string, so you can renumber (`"01"`, `"02"`, ...) if you delete one from the middle.

### Add/remove Cast members

`mainCast.bride` / `mainCast.groom` are fixed (every wedding has exactly one of each). `specialAppearances` is a free list — add or remove `{ name, role, image }` objects for parents, bridesmaids, groomsmen, close friends, etc.

### Send A Gift (bank accounts)

`giftAccounts` in `lib/content.ts` lists each `{ owner, bankName, accountNumber, accountHolder }`. Add one entry per person receiving gifts, or clear the array (`giftAccounts: []`) to hide the whole "Send A Gift" section — it disappears automatically. `giftNote` is the short line shown above the account cards.

### Guest Book messages

Unlike the other sections, Guest Book messages are **not** edited in `lib/content.ts` — they come entirely from real guest submissions stored in `data/guestbook.json` (see [RSVP & Guest Book](#rsvp--guest-book) below). The `reviews` field in `lib/content.ts` stays empty; it only exists to document the message shape. To remove a message a guest left, open `data/guestbook.json` and delete its entry.

## Photos & video

All media lives in `public/images/` and `public/videos/`, referenced by path from `lib/content.ts`. If a file listed in `lib/content.ts` is missing, that slot automatically falls back to a styled placeholder instead of a broken image — so it's safe to swap files in one at a time.

| File | Used for |
|---|---|
| `public/images/profile.jpg` | The single profile avatar on "Who's Watching?" **and** the small avatar in the header once inside the page |
| `public/images/hero.jpg` | Full-bleed hero background |
| `public/images/trailer-poster.jpg` | Poster shown before the trailer video loads/plays |
| `public/images/episode-1.jpg` … `episode-4.jpg` | Our Story episode thumbnails (16:9 looks best) |
| `public/images/bride.jpg`, `groom.jpg` | Main Cast portraits (3:4 looks best) |
| `public/images/cast-1.jpg` … `cast-4.jpg` | Special Appearances (square-ish) |
| `public/images/gallery-*.jpg` | Memories gallery — filenames are free-form, just point `gallery[].image` at whatever you name them |
| `public/videos/trailer.mp4` | Autoplay-muted trailer video (vertical 9:16, under ~15MB recommended) |
| `public/intro.mp3` | Short "ta-dum"-style sound that plays the moment a guest taps their profile |

The current repo ships with free stock placeholder photos (Picsum Photos) and a royalty-free sample video/clip so you can see proportions and layout before dropping in real photos — replace them at your own pace, section by section.

## Guest name from URL

`/to/<slug>` (e.g. `/to/budi-santoso`) shows that name on the profile screen and throughout the page (RSVP, guest book, "Welcome, ___"). Visiting `/` with no slug asks the guest to type their name, then updates the URL to their personalized link without reloading the page.

## RSVP & Guest Book

Both submit to `app/api/rsvp` and `app/api/guestbook`, which append to JSON files under `data/`. That's enough for a self-hosted server (a small VPS, `next start`), but on serverless platforms (Vercel, etc.) the filesystem is ephemeral — swap those two route handlers for a real datastore (Google Sheets, Supabase, Airtable...) before relying on them in production there.

The RSVP section also shows a live headcount ("X people will be there") pulled from everyone's confirmed responses. If a guest RSVPs and then leaves a Guest Book message in the same visit, their message is tagged with a small "Attending" / "Maybe" / "Can't Attend" badge automatically.

## Deploying to a VPS

See [DEPLOYMENT.md](DEPLOYMENT.md) for a full step-by-step guide: server setup, Node.js, PM2, Nginx reverse proxy, and free HTTPS via Let's Encrypt.

## After the wedding

Flip `weddingDateISO` in `lib/content.ts` to a past date and the countdown automatically becomes "NOW STREAMING". Swap `trailerVideo` for real wedding-day footage and add more photos to `gallery` — the page keeps working as a keepsake.
