export type FeeBreakdown = {
  parentPays: number;
  sitterReceives: number;
  platformRevenue: number;
  parentFeePercent: number;
  sitterFeePercent: number;
  baseValue: number;
};

export function calculateFee(completedBookingsTogether: number, bookingValue: number): FeeBreakdown {
  let parentFeePercent: number;
  let sitterFeePercent: number;

  if (completedBookingsTogether < 5) {
    parentFeePercent = 0.08;
    sitterFeePercent = 0.04;
  } else if (completedBookingsTogether < 20) {
    parentFeePercent = 0.04;
    sitterFeePercent = 0.02;
  } else {
    parentFeePercent = 0.02;
    sitterFeePercent = 0.01;
  }

  return {
    parentPays: bookingValue * (1 + parentFeePercent),
    sitterReceives: bookingValue * (1 - sitterFeePercent),
    platformRevenue: bookingValue * (parentFeePercent + sitterFeePercent),
    parentFeePercent,
    sitterFeePercent,
    baseValue: bookingValue,
  };
}

export function formatCurrency(value: number, currency: "GBP" | "AED" = "GBP") {
  if (currency === "AED") return `AED ${value.toFixed(2)}`;
  return `£${value.toFixed(2)}`;
}
