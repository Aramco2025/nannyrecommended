// MOCK airtime top-up — replace with DT One.
export async function topUpPhone(opts: { amountMinor: number; operator: "etisalat" | "du"; phoneNumber: string }) {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    reference: `MOCK-${opts.operator.toUpperCase()}-${Date.now().toString().slice(-8)}`,
  };
}
