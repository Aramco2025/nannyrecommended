// Per-sitter rate surcharges. All values are AED/hour deltas added to base.
// Public holidays are a stub list — extend per emirate as needed.

export type Surcharges = {
  evening: number;       // after 21:00
  lateNight: number;     // after 00:00 (any minute past midnight)
  weekend: number;       // Sat / Sun (UAE weekend is Sat-Sun in this codebase)
  holiday: number;       // matches UAE_HOLIDAYS
  multiChild: number;    // per extra child after the first
  lastMinute: number;    // booking starts within 4 hours
};

export const ZERO_SURCHARGES: Surcharges = {
  evening: 0, lateNight: 0, weekend: 0, holiday: 0, multiChild: 0, lastMinute: 0,
};

// UAE public holidays — partial / illustrative. Replace with a regional source.
const UAE_HOLIDAYS = new Set<string>([
  "2026-01-01", "2026-12-02", "2026-12-03", // New Year + National Day
]);

export type AppliedSurcharge = { label: string; amountPerHour: number };

export function computeSurcharges(opts: {
  start: Date;
  hours: number;
  childCount: number;
  bookedAt?: Date;       // for last-minute detection
  rates: Surcharges;
}): { applied: AppliedSurcharge[]; effectiveExtraPerHour: number } {
  const { start, hours, childCount, rates } = opts;
  const bookedAt = opts.bookedAt ?? new Date();
  const applied: AppliedSurcharge[] = [];

  const end = new Date(start.getTime() + hours * 3600_000);
  const startHour = start.getHours();
  const endHour = end.getHours() + (end.getDate() !== start.getDate() ? 24 : 0);

  if (rates.evening > 0 && (startHour >= 21 || endHour > 21)) {
    applied.push({ label: "Evening surcharge (after 9pm)", amountPerHour: rates.evening });
  }
  if (rates.lateNight > 0 && endHour > 24) {
    applied.push({ label: "Late-night surcharge (after midnight)", amountPerHour: rates.lateNight });
  }
  const dow = start.getDay(); // 0 Sun .. 6 Sat
  if (rates.weekend > 0 && (dow === 0 || dow === 6)) {
    applied.push({ label: "Weekend rate", amountPerHour: rates.weekend });
  }
  const dateStr = start.toISOString().slice(0, 10);
  if (rates.holiday > 0 && UAE_HOLIDAYS.has(dateStr)) {
    applied.push({ label: "Public holiday rate", amountPerHour: rates.holiday });
  }
  if (rates.multiChild > 0 && childCount > 1) {
    applied.push({
      label: `Multi-child surcharge (+${childCount - 1} child${childCount - 1 === 1 ? "" : "ren"})`,
      amountPerHour: rates.multiChild * (childCount - 1),
    });
  }
  const hoursNotice = (start.getTime() - bookedAt.getTime()) / 3600_000;
  if (rates.lastMinute > 0 && hoursNotice < 4 && hoursNotice >= 0) {
    applied.push({ label: "Last-minute booking (<4h notice)", amountPerHour: rates.lastMinute });
  }

  const effectiveExtraPerHour = applied.reduce((acc, s) => acc + s.amountPerHour, 0);
  return { applied, effectiveExtraPerHour };
}
