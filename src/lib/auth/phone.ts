import { parsePhoneNumberFromString, AsYouType, CountryCode } from "libphonenumber-js";

// Curated default order — every country technically allowed via libphonenumber.
export const COMMON_REGIONS: { code: CountryCode; label: string; dial: string }[] = [
  { code: "AE", label: "United Arab Emirates", dial: "+971" },
  { code: "GB", label: "United Kingdom", dial: "+44" },
  { code: "SA", label: "Saudi Arabia", dial: "+966" },
  { code: "US", label: "United States", dial: "+1" },
  { code: "IN", label: "India", dial: "+91" },
  { code: "PK", label: "Pakistan", dial: "+92" },
  { code: "PH", label: "Philippines", dial: "+63" },
  { code: "EG", label: "Egypt", dial: "+20" },
  { code: "FR", label: "France", dial: "+33" },
  { code: "DE", label: "Germany", dial: "+49" },
  { code: "AU", label: "Australia", dial: "+61" },
  { code: "CA", label: "Canada", dial: "+1" },
];

export function formatAsYouType(input: string, region: CountryCode = "AE") {
  return new AsYouType(region).input(input);
}

export function toE164(input: string, region: CountryCode = "AE"): string | null {
  if (!input) return null;
  const p = parsePhoneNumberFromString(input, region);
  if (!p || !p.isValid()) return null;
  return p.number; // E.164
}
