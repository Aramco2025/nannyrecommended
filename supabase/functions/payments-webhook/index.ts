// Stripe webhook — confirms booking, holds escrow, and records payment events.
// Lovable registers this endpoint automatically: ?env=sandbox (test) or ?env=live.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyWebhook, type StripeEnv } from "../_shared/stripe.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  const url = new URL(req.url);
  const rawEnv = url.searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ ignored: "invalid env" }), { status: 200 });
  }
  const env: StripeEnv = rawEnv;

  let event: { type: string; data: { object: any } };
  try {
    event = await verifyWebhook(req, env);
  } catch (e) {
    console.error("webhook verify failed", (e as Error).message);
    return new Response("invalid signature", { status: 400 });
  }
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "transaction.completed": {
        const session = event.data.object;
        const bookingId = session?.metadata?.booking_id;
        if (!bookingId) break;

        const { data: booking } = await admin
          .from("bookings").select("id,status,parent_id,total_aed,sitter_id").eq("id", bookingId).maybeSingle();
        if (!booking) break;
        if (booking.status === "confirmed" || booking.status === "completed") break;

        const pi = (session.payment_intent as string | null) ?? null;
        await admin.from("bookings").update({
          status: "pending",
          escrow_held: true,
          paid_at: new Date().toISOString(),
          payment_method_ref: pi ?? session.id,
          stripe_payment_intent_id: pi,
        }).eq("id", bookingId);

        // Record the charge so /account/billing shows real history
        if (pi) {
          await admin.from("charges").upsert({
            user_id: booking.parent_id,
            booking_id: bookingId,
            stripe_payment_intent_id: pi,
            stripe_session_id: session.id,
            amount_minor_units: Math.round(Number(booking.total_aed) * 100),
            currency: "AED",
            status: "succeeded",
            description: `Booking ${bookingId}`,
            environment: env,
          }, { onConflict: "stripe_payment_intent_id" });
        }

        await admin.from("notifications").insert({
          user_id: booking.parent_id,
          type: "booking_awaiting_sitter",
          title: "Payment received",
          body: "We've notified the sitter. You'll hear back shortly.",
          link: "/account",
        });

        const { data: bk } = await admin
          .from("bookings").select("sitter_id,start_at,hours").eq("id", bookingId).maybeSingle();
        if (bk) {
          const { data: s } = await admin
            .from("sitters").select("user_id").eq("id", bk.sitter_id).maybeSingle();
          if (s?.user_id) {
            await admin.from("notifications").insert({
              user_id: s.user_id,
              type: "booking_request",
              title: "New booking request 🎉",
              body: `A parent booked ${bk.hours}h. Accept to confirm.`,
              link: "/sitter/dashboard",
            });
          }
        }
        break;
      }

      case "charge.succeeded": {
        // Persist receipt URL + card metadata for the booking
        const charge = event.data.object;
        const pi = charge.payment_intent as string | null;
        if (pi) {
          await admin.from("charges").update({
            receipt_url: charge.receipt_url ?? null,
            stripe_charge_id: charge.id,
            payment_method_brand: charge.payment_method_details?.card?.brand ?? null,
            payment_method_last4: charge.payment_method_details?.card?.last4 ?? null,
            status: "succeeded",
          }).eq("stripe_payment_intent_id", pi);
        }
        break;
      }

      case "checkout.session.expired":
      case "transaction.payment_failed": {
        const bookingId = event.data.object?.metadata?.booking_id;
        if (bookingId) {
          await admin.from("bookings")
            .update({ status: "cancelled" })
            .eq("id", bookingId)
            .eq("status", "pending_payment");
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const pi = charge.payment_intent as string | null;
        if (!pi) break;
        const { data: c } = await admin.from("charges")
          .select("id").eq("stripe_payment_intent_id", pi).maybeSingle();
        if (!c) break;
        const refunds = charge.refunds?.data ?? [];
        for (const r of refunds) {
          await admin.from("refunds").upsert({
            charge_id: c.id,
            stripe_refund_id: r.id,
            amount_minor_units: r.amount,
            currency: (r.currency ?? "aed").toUpperCase(),
            reason: r.reason ?? null,
            status: r.status ?? "succeeded",
          }, { onConflict: "stripe_refund_id" });
        }
        await admin.from("charges").update({
          status: charge.refunded ? "refunded" : "partially_refunded",
        }).eq("id", c.id);
        break;
      }

      case "transfer.created":
      case "transfer.updated":
      case "transfer.paid":
      case "transfer.failed": {
        const t = event.data.object;
        const status = event.type === "transfer.failed" ? "failed"
          : event.type === "transfer.paid" ? "paid"
          : "pending";
        await admin.from("sitter_payouts")
          .update({ status, failure_reason: t.failure_message ?? null })
          .eq("stripe_transfer_id", t.id);
        if (status === "paid") {
          const cor = t.metadata?.cash_out_request_id;
          if (cor) {
            await admin.from("cash_out_requests")
              .update({ status: "completed", completed_at: new Date().toISOString() })
              .eq("id", cor);
          }
        }
        break;
      }

      case "account.updated": {
        const acc = event.data.object;
        const onboarded = acc.charges_enabled && acc.payouts_enabled;
        await admin.from("profiles")
          .update({ stripe_connect_onboarded: !!onboarded })
          .eq("stripe_connect_account_id", acc.id);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        const item = sub.items?.data?.[0];
        const priceId = item?.price?.metadata?.lovable_external_id
          ?? sub.metadata?.priceId ?? item?.price?.id;
        const productId = item?.price?.product;
        const periodStart = item?.current_period_start ?? sub.current_period_start;
        const periodEnd = item?.current_period_end ?? sub.current_period_end;
        const plan = sub.metadata?.plan ?? "family_plus";

        await admin.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer,
          plan,
          price_id: priceId,
          product_id: productId,
          status: sub.status,
          current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          cancel_at_period_end: sub.cancel_at_period_end || false,
          environment: env,
          updated_at: new Date().toISOString(),
        }, { onConflict: "stripe_subscription_id" });

        // Revoke immediately on cancel-at-period-end (per project policy: revoke on cancel).
        const isActive = ["active", "trialing"].includes(sub.status) && !sub.cancel_at_period_end;
        await admin.from("profiles")
          .update({ is_family_plus: isActive, stripe_customer_id: sub.customer as string })
          .eq("id", userId);

        if (event.type === "customer.subscription.created" && isActive) {
          await admin.from("notifications").insert({
            user_id: userId,
            type: "subscription_active",
            title: "Welcome to Family Plus 🎉",
            body: "Unlimited messages, concierge sourcing and priority support are now active.",
            link: "/account",
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await admin.from("subscriptions").update({
          status: "canceled",
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        }).eq("stripe_subscription_id", sub.id).eq("environment", env);
        if (sub.metadata?.userId) {
          await admin.from("profiles")
            .update({ is_family_plus: false })
            .eq("id", sub.metadata.userId);
        }
        break;
      }

      default:
        // Unhandled events are fine — just 200.
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("webhook handler error", e);
    return new Response("error", { status: 500 });
  }
});
