import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/booking/ReviewForm";
import { ParentRatingForm } from "@/components/booking/ParentRatingForm";
import { Loader2, ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/fees";

type B = {
  id: string; parent_id: string; sitter_id: string; status: string;
  total_aed: number; tip_aed: number | null;
  sitters?: { full_name: string | null; user_id: string | null } | null;
  profiles?: { full_name: string | null } | null;
};

const TIP_OPTIONS = [0, 10, 25, 50];

export default function BookingReview() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [b, setB] = useState<B | null>(null);
  const [tip, setTip] = useState<number>(25);
  const [savingTip, setSavingTip] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("bookings")
      .select("id, parent_id, sitter_id, status, total_aed, tip_aed, sitters:sitter_id(full_name, user_id), profiles:parent_id(full_name)")
      .eq("id", id).maybeSingle().then(({ data }) => {
        setB(data as any);
        if ((data as any)?.tip_aed != null) setTip(Number((data as any).tip_aed));
      });
  }, [id]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (!b) return <div className="min-h-screen bg-background"><Header /><main className="container py-12 text-center text-sm text-slate-grey">Loading…</main></div>;

  const isParent = b.parent_id === user.id;
  const isSitter = b.sitters?.user_id === user.id;
  if (!isParent && !isSitter) return <Navigate to="/account" replace />;

  const saveTip = async (val: number) => {
    if (!isParent) return;
    setTip(val);
    setSavingTip(true);
    const { error } = await supabase.from("bookings").update({ tip_aed: val }).eq("id", b.id);
    setSavingTip(false);
    if (error) toast.error(error.message);
    else toast.success(val > 0 ? `Tip of ${formatCurrency(val)} added` : "Tip removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-8">
        <Link to={`/bookings/${b.id}`} className="inline-flex items-center gap-2 text-sm text-slate-grey hover:text-pitch-black">
          <ArrowLeft className="h-4 w-4" /> Back to booking
        </Link>

        <h1 className="mt-4 font-display text-2xl font-bold text-pitch-black">
          {isParent ? "Rate your sitter" : "Rate this family"}
        </h1>
        <p className="mt-1 text-sm text-slate-grey">
          {isParent
            ? "Your honest feedback helps other parents and rewards great sitters."
            : "Stays private to you and our team — helps match you with great families."}
        </p>

        {isParent && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-pitch-black">
              <Heart className="h-4 w-4 text-salmon-deep" />
              <h2 className="font-display text-base font-bold">Add a tip (optional)</h2>
            </div>
            <p className="mt-1 text-xs text-slate-grey">100% goes to {b.sitters?.full_name ?? "your sitter"}.</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {TIP_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={savingTip}
                  onClick={() => saveTip(v)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    tip === v
                      ? "border-pitch-black bg-pitch-black text-pure-white"
                      : "border-border bg-card text-slate-grey hover:bg-cream"
                  }`}
                >
                  {v === 0 ? "No tip" : `AED ${v}`}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6">
          {isParent ? (
            <ReviewForm
              bookingId={b.id}
              parentId={b.parent_id}
              sitterId={b.sitter_id}
              onSubmitted={() => { setReviewDone(true); navigate(`/bookings/${b.id}`); }}
            />
          ) : (
            <ParentRatingForm
              bookingId={b.id}
              parentId={b.parent_id}
              sitterId={b.sitter_id}
              parentName={b.profiles?.full_name ?? "this family"}
              onSubmitted={() => { setReviewDone(true); navigate(`/bookings/${b.id}`); }}
            />
          )}
        </div>

        {reviewDone && (
          <Button asChild className="mt-4 w-full">
            <Link to={`/bookings/${b.id}`}>Done</Link>
          </Button>
        )}
      </main>
    </div>
  );
}
