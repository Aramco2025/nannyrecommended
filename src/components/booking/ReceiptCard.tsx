import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, ExternalLink, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type Charge = {
  id: string;
  receipt_url: string | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  amount_minor_units: number;
  currency: string;
  status: string;
};

export function ReceiptCard({ bookingId }: { bookingId: string }) {
  const [charge, setCharge] = useState<Charge | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("charges")
      .select("id, receipt_url, payment_method_brand, payment_method_last4, amount_minor_units, currency, status")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled) setCharge((data ?? null) as Charge | null); });
    return () => { cancelled = true; };
  }, [bookingId]);

  if (!charge) return null;

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full bg-cream p-2">
            <Receipt className="h-4 w-4 text-pitch-black" />
          </div>
          <div>
            <div className="text-sm font-semibold text-pitch-black">Payment receipt</div>
            <div className="text-xs text-slate-grey inline-flex items-center gap-1.5">
              {charge.payment_method_brand && (
                <>
                  <CreditCard className="h-3 w-3" />
                  <span className="capitalize">{charge.payment_method_brand}</span>
                  {charge.payment_method_last4 && <span>•••• {charge.payment_method_last4}</span>}
                </>
              )}
              {!charge.payment_method_brand && <span>Card payment</span>}
            </div>
          </div>
        </div>
        {charge.receipt_url && (
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href={charge.receipt_url} target="_blank" rel="noopener noreferrer">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
