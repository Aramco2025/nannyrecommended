import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useReferralCode, useReferralStats } from "@/hooks/useReferral";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Share2, Gift, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Referrals() {
  const { user, loading } = useAuth();
  const { data: code } = useReferralCode();
  const { data: stats } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => code ? `${window.location.origin}/auth?mode=signup&ref=${code}` : "", [code]);

  useEffect(() => { if (copied) { const t = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(t); } }, [copied]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin&redirect=/referrals" replace />;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Link copied" });
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Join NannyRecommended", text: "Use my code for AED 50 off your first booking", url: link }); } catch {}
    } else { copy(); }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />
      <main className="container max-w-2xl py-8 md:py-12">
        <div className="rounded-3xl bg-pure-white p-6 shadow-card md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-salmon-soft text-salmon-deep"><Gift className="h-6 w-6" /></div>
            <div>
              <h1 className="font-display text-2xl font-bold text-pitch-black md:text-3xl">Give AED 50, get AED 50</h1>
              <p className="text-sm text-slate-grey">Share your code. When a friend completes their first booking, you both get AED 50 in credit.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cream-deep p-4">
            <div className="text-xs uppercase tracking-wide text-slate-grey">Your code</div>
            <div className="mt-1 font-display text-3xl font-bold tracking-widest text-pitch-black">{code ?? "…"}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={copy} variant="outline" className="rounded-full"><span className="inline-flex items-center gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}Copy link</span></Button>
              <Button onClick={share} className="rounded-full bg-salmon text-pure-white hover:bg-salmon-deep"><span className="inline-flex items-center gap-2"><Share2 className="h-4 w-4" />Share</span></Button>
            </div>
            <div className="mt-3 break-all text-xs text-slate-grey">{link}</div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Stat label="Invited" value={stats?.total ?? 0} />
            <Stat label="Rewarded" value={stats?.rewarded ?? 0} />
            <Stat label="Earned" value={`AED ${stats?.earnedAed ?? 0}`} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-off-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-grey">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-pitch-black">{value}</div>
    </div>
  );
}
