/**
 * Lightweight detection of contact-exchange attempts in chat.
 * Designed to nudge — not block — and to keep conversations (and dispute
 * evidence + insurance) on-platform.
 */

const PHONE_RE =
  /(?:\+?\d[\d\s().-]{7,}\d)|(?:\b0\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b)/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const HANDLE_RE = /(?:^|\s)@[A-Za-z0-9_.]{3,}/;
const URL_RE = /\b(?:https?:\/\/|www\.)\S{4,}/i;

const KEYWORD_RE =
  /\b(whats?app|wa\.me|telegram|signal|imessage|insta(?:gram)?|snap(?:chat)?|facebook|messenger|skype|viber|wechat|zalo|line\b|cash on delivery|venmo|paypal|zelle|bank transfer|iban|cash|outside the app|off ?app|off ?platform)\b/i;

export type ContactRisk = {
  level: "none" | "soft" | "hard";
  reasons: string[];
};

export function detectContactRisk(text: string): ContactRisk {
  const reasons: string[] = [];
  if (PHONE_RE.test(text)) reasons.push("phone number");
  if (EMAIL_RE.test(text)) reasons.push("email address");
  if (HANDLE_RE.test(text)) reasons.push("social handle");
  if (URL_RE.test(text)) reasons.push("external link");
  const kw = text.match(KEYWORD_RE);
  if (kw) reasons.push(`mention of "${kw[0].trim().toLowerCase()}"`);

  if (reasons.length === 0) return { level: "none", reasons };
  // Phone / email are stronger signals → hard warning.
  const hard = /phone|email/.test(reasons.join(" "));
  return { level: hard ? "hard" : "soft", reasons };
}
