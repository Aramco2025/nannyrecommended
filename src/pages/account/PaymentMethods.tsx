import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Plus, Star, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Method = {
  id: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
};

const PaymentMethods = () => {
  const { user, loading } = useAuth();
  const [methods, setMethods] = useState<Method[] | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payment_methods")
      .select("id, brand, last4, exp_month, exp_year, is_default")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setMethods(data ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const setDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("payment_methods").update({ is_default: true }).eq("id", id);
    toast({ title: "Default updated" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    await supabase.from("payment_methods").delete().eq("id", id);
    toast({ title: "Card removed" });
    load();
  };

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-cream pb-20">
      <Header />
      <main className="container max-w-2xl py-8">
        <Link to="/account" className="inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
          <ChevronLeft className="h-4 w-4" /> Back to account
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-pitch-black">Payment methods</h1>
        <p className="mt-1 text-sm text-slate-grey">Cards saved for faster, secure checkout.</p>

        <div className="mt-6 space-y-3">
          {methods === null ? (
            <div className="grid place-items-center rounded-2xl bg-pure-white p-12 shadow-card">
              <Loader2 className="h-5 w-5 animate-spin text-slate-grey" />
            </div>
          ) : methods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-deep bg-pure-white p-10 text-center">
              <CreditCard className="mx-auto mb-3 h-8 w-8 text-slate-grey" />
              <h3 className="font-display text-lg font-bold text-pitch-black">No saved cards yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-grey">
                Cards are saved automatically the first time you book — there's no setup required upfront.
              </p>
              <Button asChild className="mt-4 rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <Link to="/sitters">Find a sitter</Link>
              </Button>
            </div>
          ) : (
            methods.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-2xl bg-pure-white p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-pitch-black">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-pitch-black">
                      {(m.brand || "Card").toUpperCase()} •••• {m.last4 || "----"}
                      {m.is_default && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-success-green/10 px-2 py-0.5 text-[10px] font-bold text-success-green">
                          <Star className="h-3 w-3" /> Default
                        </span>
                      )}
                    </div>
                    {m.exp_month && m.exp_year && (
                      <div className="text-xs text-slate-grey">
                        Expires {String(m.exp_month).padStart(2, "0")}/{String(m.exp_year).slice(-2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!m.is_default && (
                    <Button variant="ghost" size="sm" onClick={() => setDefault(m.id)} className="text-xs">
                      Make default
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => remove(m.id)} className="text-slate-grey hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => toast({ title: "Add card at checkout", description: "Cards are added the first time you book a sitter." })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-cream-deep bg-pure-white/50 p-4 text-sm font-semibold text-slate-grey hover:bg-pure-white hover:text-pitch-black"
          >
            <Plus className="h-4 w-4" /> Add a card
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentMethods;
