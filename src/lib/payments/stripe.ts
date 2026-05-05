// Real Stripe integration via Lovable's built-in Stripe.
// Booking checkout uses Embedded Checkout in src/pages/Booking.tsx
// (createBookingCheckout below is the helper that calls the edge function).
import { supabase } from "@/integrations/supabase/client";

export type StripeEnv = "sandbox" | "live";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function getStripeEnvironment(): StripeEnv {
  return clientToken?.startsWith("pk_live_") ? "live" : "sandbox";
}

export function isTestMode(): boolean {
  return getStripeEnvironment() === "sandbox";
}

export async function createBookingCheckout(args: {
  sitter_id: string;
  start_at: string; // ISO
  hours: number;
  address?: string | null;
  notes?: string | null;
  children_ids?: string[];
  pets?: unknown[];
  parking?: string | null;
  return_url: string;
}): Promise<{ booking_id: string; client_secret: string }> {
  const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
    body: { ...args, environment: getStripeEnvironment() },
  });
  if (error) throw new Error(error.message);
  if (!data?.client_secret || !data?.booking_id) {
    throw new Error("Checkout session could not be created");
  }
  return { booking_id: data.booking_id, client_secret: data.client_secret };
}

export async function refundBooking(args: {
  booking_id: string;
  amount_minor_units?: number; // omit for full refund
  reason?: string;
}): Promise<{ refund_id: string; status: string }> {
  const { data, error } = await supabase.functions.invoke("refund-booking", {
    body: { ...args, environment: getStripeEnvironment() },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function createConnectOnboardingLink(): Promise<{ url: string }> {
  const { data, error } = await supabase.functions.invoke(
    "stripe-connect-onboarding",
    { body: { environment: getStripeEnvironment() } },
  );
  if (error) throw new Error(error.message);
  return data;
}

export async function transferToSitter(args: {
  cash_out_request_id: string;
}): Promise<{ transfer_id: string; status: string }> {
  const { data, error } = await supabase.functions.invoke("stripe-transfer-payout", {
    body: { ...args, environment: getStripeEnvironment() },
  });
  if (error) throw new Error(error.message);
  return data;
}
