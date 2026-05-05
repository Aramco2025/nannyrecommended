import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatMoney, toMinor } from "@/lib/money";
import { Banknote, Building2, Gift, Phone, ArrowLeft, Loader2, CheckCircle2, Copy } from "lucide-react";

type Method = "exchange_house_pickup" | "bank_transfer" | "voucher" | "airtime";
type Step = "amount" | "method" | "destination" | "confirm" | "success";

const METHODS: { id: Method; icon: any; title: string; sub: string; speed: string }[] = [
  { id: "exchange_house_pickup", icon: Banknote, title: "Cash pickup", sub: "Collect at any Al Ansari or Lulu Exchange", speed: "Usually within 4 hours" },
  { id: "bank_transfer", icon: Building2, title: "Bank transfer", sub: "Direct to your bank account", speed: "1–2 working days" },
  { id: "voucher", icon: Gift, title: "Voucher", sub: "Carrefour, Lulu Hyper or Spinneys", speed: "Instant" },
  { id: "airtime", icon: Phone, title: "Phone top-up", sub: "Etisalat or du airtime credit", speed: "Instant" },
];

const CashOut = () => {
  const { user, loading: authLoading } = useAuth();
  const { wallet, refresh } = useWallet();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [locationId, setLocationId] = useState<string>("");
  const [iban, setIban] = useState("");
  const [holder, setHolder] = useState("");
  const [voucherProvider, setVoucherProvider] = useState("carrefour");
  const [airtimeOperator, setAirtimeOperator] = useState<"etisalat" | "du">("etisalat");
  const [airtimePhone, setAirtimePhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [pickupCode, setPickupCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("pickup_locations").select("*").eq("active", true).then(({ data }) => setLocations(data ?? []));
  }, []);

  if (authLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const amountMinor = toMinor(Number(amount) || 0);
  const balance = wallet?.balance_minor_units ?? 0;
  const valid = amountMinor > 0 && amountMinor <= balance;

  const submit = async () => {
    if (!method) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.rpc("request_cash_out", {
        _amount: amountMinor,
        _method: method,
        _exchange_house: method === "exchange_house_pickup" ? locations.find(l => l.id === locationId)?.provider : null,
        _pickup_location_id: method === "exchange_house_pickup" ? locationId : null,
        _bank_iban: method === "bank_transfer" ? iban : null,
        _bank_account_holder: method === "bank_transfer" ? holder : null,
        _voucher_provider: method === "voucher" ? voucherProvider : null,
        _airtime_operator: method === "airtime" ? airtimeOperator : null,
        _airtime_phone: method === "airtime" ? airtimePhone : null,
      });
      if (error) throw error;
      // fetch pickup code if generated
      if (method === "exchange_house_pickup" && data) {
        const { data: cor } = await supabase.from("cash_out_requests").select("pickup_reference").eq("id", data as string).maybeSingle();
        setPickupCode(cor?.pickup_reference ?? null);
      }
      await refresh();
      setStep("success");
    } catch (e: any) {
      toast({ title: "Could not request cash-out", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const back = () => {
    if (step === "method") setStep("amount");
    else if (step === "destination") setStep("method");
    else if (step === "confirm") setStep("destination");
    else navigate("/sitter/wallet");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-8">
        {step !== "success" && (
          <button onClick={back} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        {step === "amount" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-pitch-black">How much?</h1>
            <p className="mt-1 text-sm text-slate-grey">You have {formatMoney(balance)} available.</p>
            <div className="mt-6">
              <Label className="text-xs text-slate-grey">Amount (AED)</Label>
              <Input type="number" inputMode="decimal" min={1} value={amount}
                onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 h-14 text-2xl" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[100, 500, 1000].map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-off-white">AED {v}</button>
              ))}
              <button onClick={() => setAmount(String(balance / 100))}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-off-white">All available</button>
            </div>
            <p className="mt-3 text-xs text-slate-grey">No fees on cash-out under AED 5,000/month.</p>
            <Button disabled={!valid} className="mt-6 w-full bg-salmon hover:bg-salmon-deep"
              onClick={() => setStep("method")}>Continue</Button>
          </section>
        )}

        {step === "method" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-pitch-black">Where do you want it?</h1>
            <p className="mt-1 text-sm text-slate-grey">Pick what works for you. You can change this anytime.</p>
            <div className="mt-6 grid gap-3">
              {METHODS.map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); setStep("destination"); }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition hover:border-salmon">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-salmon/10 text-salmon-deep"><m.icon className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="font-semibold text-pitch-black">{m.title}</div>
                    <div className="text-xs text-slate-grey">{m.sub}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-grey">{m.speed}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "destination" && method === "exchange_house_pickup" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-pitch-black">Pick a branch</h1>
            <p className="mt-1 text-sm text-slate-grey">Show your Emirates ID and the 6-digit code at the counter.</p>
            <div className="mt-4 space-y-2">
              {locations.map(l => (
                <button key={l.id} onClick={() => setLocationId(l.id)}
                  className={`flex w-full flex-col items-start rounded-2xl border p-4 text-left transition ${locationId === l.id ? "border-salmon bg-salmon/5" : "border-border bg-card"}`}>
                  <div className="font-medium text-pitch-black">{l.branch_name}</div>
                  <div className="text-xs text-slate-grey">{l.address} · {l.hours}</div>
                </button>
              ))}
            </div>
            <Button disabled={!locationId} className="mt-6 w-full bg-salmon hover:bg-salmon-deep" onClick={() => setStep("confirm")}>Continue</Button>
          </section>
        )}

        {step === "destination" && method === "bank_transfer" && (
          <BankTransferConnect
            onReady={() => setStep("confirm")}
          />
        )}

        {step === "destination" && method === "voucher" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-pitch-black">Pick a voucher</h1>
            <p className="mt-1 text-sm text-slate-grey">Sent to your registered phone via SMS.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[{ id: "carrefour", name: "Carrefour" }, { id: "lulu_hyper", name: "Lulu Hypermarket" }, { id: "spinneys", name: "Spinneys" }].map(v => (
                <button key={v.id} onClick={() => setVoucherProvider(v.id)}
                  className={`rounded-2xl border p-4 text-sm font-medium transition ${voucherProvider === v.id ? "border-salmon bg-salmon/5" : "border-border bg-card"}`}>
                  {v.name}
                </button>
              ))}
            </div>
            <Button className="mt-6 w-full bg-salmon hover:bg-salmon-deep" onClick={() => setStep("confirm")}>Continue</Button>
          </section>
        )}

        {step === "destination" && method === "airtime" && (
          <section className="space-y-4">
            <h1 className="font-display text-2xl font-semibold text-pitch-black">Phone top-up</h1>
            <div className="grid grid-cols-2 gap-3">
              {(["etisalat", "du"] as const).map(op => (
                <button key={op} onClick={() => setAirtimeOperator(op)}
                  className={`rounded-2xl border p-4 text-sm font-medium capitalize transition ${airtimeOperator === op ? "border-salmon bg-salmon/5" : "border-border bg-card"}`}>{op}</button>
              ))}
            </div>
            <div><Label className="text-xs text-slate-grey">Phone number</Label>
              <Input value={airtimePhone} onChange={e => setAirtimePhone(e.target.value)} placeholder="+9715..." maxLength={20} /></div>
            <Button disabled={airtimePhone.length < 8} className="w-full bg-salmon hover:bg-salmon-deep" onClick={() => setStep("confirm")}>Continue</Button>
          </section>
        )}

        {step === "confirm" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-pitch-black">Confirm cash-out</h1>
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card">
              <Row label="Amount" value={formatMoney(amountMinor)} bold />
              <Row label="Method" value={METHODS.find(m => m.id === method)?.title ?? ""} />
              <Row label="Timing" value={METHODS.find(m => m.id === method)?.speed ?? ""} />
            </div>
            <Button disabled={busy} onClick={submit} className="mt-6 w-full bg-salmon hover:bg-salmon-deep">
              {busy ? "Processing…" : "Confirm cash-out"}
            </Button>
            <p className="mt-2 text-center text-xs text-slate-grey">You can cancel up to 30 minutes after requesting.</p>
          </section>
        )}

        {step === "success" && (
          <section className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-green/15 text-success-green">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-pitch-black">All set</h1>
            {pickupCode ? (
              <>
                <p className="mt-2 text-sm text-slate-grey">Show this code with your Emirates ID at the counter.</p>
                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border-2 border-salmon bg-salmon/5 px-6 py-4">
                  <span className="font-display text-4xl font-semibold tracking-widest tabular-nums text-pitch-black">{pickupCode}</span>
                  <button onClick={() => navigator.clipboard.writeText(pickupCode)} className="text-slate-grey hover:text-pitch-black"><Copy className="h-4 w-4" /></button>
                </div>
                <p className="mt-4 text-xs text-slate-grey">We'll text you when it's ready (usually within 4 hours).</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-grey">We'll process your request shortly. You'll get a notification when it's done.</p>
            )}
            <Button onClick={() => navigate("/sitter/wallet")} className="mt-8 w-full bg-pitch-black hover:bg-pitch-black/90">Back to wallet</Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-sm text-slate-grey">{label}</span>
      <span className={`tabular-nums ${bold ? "text-base font-semibold text-pitch-black" : "text-sm text-pitch-black"}`}>{value}</span>
    </div>
  );
}

export default CashOut;
