import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export default function SubscriptionReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { isFamilyPlus, refetch } = useSubscription();
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (isFamilyPlus || tries >= 10) return;
    const t = setTimeout(() => { refetch(); setTries(n => n + 1); }, 1500);
    return () => clearTimeout(t);
  }, [isFamilyPlus, tries, refetch]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-16 text-center">
        {!sessionId && <p className="text-sm text-slate-grey">No checkout session found.</p>}
        {sessionId && !isFamilyPlus && (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-salmon" />
            <h1 className="mt-4 font-display text-2xl font-bold">Activating Family Plus…</h1>
            <p className="mt-2 text-sm text-slate-grey">This takes a few seconds.</p>
          </>
        )}
        {sessionId && isFamilyPlus && (
          <>
            <Sparkles className="mx-auto h-10 w-10 text-salmon-deep" />
            <h1 className="mt-4 font-display text-2xl font-bold">Welcome to Family Plus 🎉</h1>
            <p className="mt-2 text-sm text-slate-grey">
              Concierge sourcing and priority support are now active on your account.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                <Link to="/account">Go to account</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/sitters">Find a sitter</Link>
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
