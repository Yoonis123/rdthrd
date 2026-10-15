const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

/**
 * Works out whether a place is open right now from its regular opening hours.
 * (The Maps JS `place.isOpen()` helper is beta-only, so we do the maths ourselves.)
 * Returns undefined when Google has no hours for the place.
 */
export function isOpenNow(
  hours: google.maps.places.OpeningHours | null | undefined,
  utcOffsetMinutes: number | null | undefined,
  now: Date = new Date(),
): boolean | undefined {
  if (!hours?.periods?.length || utcOffsetMinutes == null) return undefined;

  // Shift "now" into the place's local time, then read it back with UTC getters.
  const local = new Date(now.getTime() + utcOffsetMinutes * 60_000);
  const nowInWeek =
    local.getUTCDay() * MINUTES_PER_DAY + local.getUTCHours() * 60 + local.getUTCMinutes();

  for (const period of hours.periods) {
    // A period with no closing time means "open 24 hours, every day".
    if (!period.close) return true;
    const open = period.open.day * MINUTES_PER_DAY + period.open.hour * 60 + period.open.minute;
    let close = period.close.day * MINUTES_PER_DAY + period.close.hour * 60 + period.close.minute;
    if (close <= open) close += MINUTES_PER_WEEK; // e.g. opens Saturday, closes Sunday 2am
    for (const t of [nowInWeek, nowInWeek + MINUTES_PER_WEEK]) {
      if (t >= open && t < close) return true;
    }
  }
  return false;
}

/** Index into Google's weekdayDescriptions (which start on Monday) for today. */
export function todayIndex(now: Date = new Date()) {
  return (now.getDay() + 6) % 7;
}
