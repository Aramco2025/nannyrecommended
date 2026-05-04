import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Banknote, Building2, Gift, Phone, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const METHODS = [
  { id: "exchange_house_pickup", icon: Banknote, title: "Cash pickup", sub: "Collect at any Al Ansari or Lulu Exchange — no bank account needed" },
  { id: "bank_transfer", icon: Building2, title: "Bank transfer", sub: "Direct to your UAE bank account" },
  { id: "voucher", icon: Gift, title: "Voucher", sub: "Carrefour, Lulu Hyper or Spinneys" },
  { id: "airtime", icon: Phone, title: "Phone top-up", sub: "Etisalat or du airtime" },
] as const;

const SitterPaymentSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const save = async () => {
    if (!picked) return navigate("/sitter/dashboard");
    setBusy(true);
    const { error } = await supabase.from("sitters").update({ preferred_payout_method: picked as any }).eq("user_id", user.id);
    setBusy(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Payment method saved" });
    navigate("/sitter/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-8">
        <h1 className="font-display text-3xl font-semibold text-pitch-black">Get paid your way</h1>
        <p className="mt-2 text-sm text-slate-grey">
          You don't need a bank account to use NannyRecommended. Pick the option that works for you — you can always change it.
        </p>

        <div className="mt-6 grid gap-3">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => setPicked(m.id)}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left shadow-card transition ${picked === m.id ? "border-salmon bg-salmon/5" : "border-border bg-card hover:border-salmon"}`}>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-salmon/10 text-salmon-deep"><m.icon className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold text-pitch-black">{m.title}</div>
                <div className="text-xs text-slate-grey">{m.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/sitter/dashboard")}>Decide later</Button>
          <Button disabled={!picked || busy} onClick={save} className="flex-1 bg-salmon hover:bg-salmon-deep">
            {busy ? "Saving…" : "Set as default"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterPaymentSetup;
