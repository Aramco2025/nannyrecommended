// Money utilities — always store as integer minor units (fils for AED, pence for GBP).
export const toMinor = (major: number) => Math.round(major * 100);
export const toMajor = (minor: number | bigint) => Number(minor) / 100;

export function formatMoney(minor: number | bigint, currency: "AED" | "GBP" = "AED") {
  const v = toMajor(minor);
  if (currency === "GBP") return `£${v.toFixed(2)}`;
  return `AED ${v.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
