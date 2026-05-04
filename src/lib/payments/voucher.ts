// MOCK voucher issue — replace with Tillo / PayMate aggregator.
export async function issueVoucher(opts: { amountMinor: number; provider: string; phoneNumber: string }) {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    voucherCode: `MOCK-${opts.provider.toUpperCase()}-${Date.now().toString().slice(-8)}`,
    redemptionInstructions: `Show this code at any ${opts.provider} branch`,
  };
}
