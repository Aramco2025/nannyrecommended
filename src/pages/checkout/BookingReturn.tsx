import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const bookingId = params.get("booking_id");
  const [status, setStatus] = useState<"processing" | "paid" | "missing">(
    sessionId ? "processing" : "missing",
  );

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    let tries = 0;
    const tick = async () => {
      tries++;
      const { data } = await supabase
        .from("bookings")
        .select("status, escrow_held, paid_at")
        .eq("id", bookingId)
        .maybeSingle();
      if (cancelled) return;
      if (data?.paid_at || data?.escrow_held) { setStatus("paid"); return; }
      if (tries < 10) setTimeout(tick, 1500);
    };
    tick();
    return () => { cancelled = true; };
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-16 text-center">
        {status === "missing" && (
          <p className="text-sm text-slate-grey">No checkout session found.</p>
        )}
        {status === "processing" && (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-salmon" />
            <h1 className="mt-4 font-display text-2xl font-bold">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-slate-grey flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" /> This usually takes a few seconds.
            </p>
          </>
        )}
        {status === "paid" && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-success-green" />
            <h1 className="mt-4 font-display text-2xl font-bold">Booking confirmed</h1>
            <p className="mt-2 text-sm text-slate-grey">We've notified your sitter — you'll hear back shortly.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                <Link to={bookingId ? `/bookings/${bookingId}` : "/account"}>View booking</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/account">Account</Link>
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
