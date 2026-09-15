type EventLike = {
  label: string;
  startISO: string;
  endISO: string;
  venueName: string;
  venueAddress: string;
};

function toGCalDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function googleCalendarUrl(event: EventLike, coupleTitle: string) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.label} — ${coupleTitle}`,
    dates: `${toGCalDate(event.startISO)}/${toGCalDate(event.endISO)}`,
    details: `You're invited to the ${event.label.toLowerCase()} of ${coupleTitle}.`,
    location: `${event.venueName}, ${event.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
