// MOCK exchange-house pickup — replace with Al Ansari / Lulu API.
export async function generatePickupCode(_opts: { amountMinor: number; sitterId: string; locationId: string }) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return {
    code,
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000),
  };
}
