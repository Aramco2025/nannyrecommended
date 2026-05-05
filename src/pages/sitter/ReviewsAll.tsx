import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const SitterReviewsAll = () => {
  const { id } = useParams<{ id: string }>();
  const [filter, setFilter] = useState<number | null>(null);

  const { data: sitter } = useQuery({
    queryKey: ["sitter_basic", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await supabase.from("sitters").select("full_name, rating, photos").eq("id", id!).maybeSingle();
      return data;
    },
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["sitter_reviews_all", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, parent_id")
        .eq("sitter_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(
    () => filter ? (reviews ?? []).filter(r => r.rating === filter) : (reviews ?? []),
    [reviews, filter]
  );

  const distribution = useMemo(() => {
    const d = [5, 4, 3, 2, 1].map(stars => ({
      stars, count: (reviews ?? []).filter(r => r.rating === stars).length,
    }));
    const max = Math.max(1, ...d.map(x => x.count));
    return d.map(x => ({ ...x, pct: (x.count / max) * 100 }));
  }, [reviews]);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1 text-slate-grey">
          <Link to={`/sitters/${id}`}><ArrowLeft className="h-4 w-4" /> Back to profile</Link>
        </Button>

        <div className="rounded-3xl bg-pure-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <img src={sitter?.photos?.[0] ?? ""} alt="" className="h-14 w-14 rounded-full bg-cream object-cover" />
            <div>
              <h1 className="font-display text-2xl font-bold text-pitch-black">Reviews for {sitter?.full_name ?? "sitter"}</h1>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-grey">
                <Star className="h-3.5 w-3.5 fill-salmon text-salmon" />
                {Number(sitter?.rating ?? 0).toFixed(1)} · {(reviews ?? []).length} review{(reviews ?? []).length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Distribution */}
          <div className="mt-6 space-y-1.5">
            {distribution.map(d => (
              <button
                key={d.stars}
                onClick={() => setFilter(filter === d.stars ? null : d.stars)}
                className={`flex w-full items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-cream ${filter === d.stars ? "bg-cream" : ""}`}
              >
                <span className="w-8 text-sm font-medium text-pitch-black">{d.stars}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-salmon" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-slate-grey">{d.count}</span>
              </button>
            ))}
            {filter && (
              <button onClick={() => setFilter(null)} className="text-xs font-semibold text-salmon-deep hover:text-salmon">
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="grid min-h-[160px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream-deep bg-pure-white p-10 text-center text-sm text-slate-grey">
              No reviews{filter ? ` with ${filter}★` : " yet"}.
            </div>
          ) : (
            filtered.map(r => (
              <article key={r.id} className="rounded-3xl bg-pure-white p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-salmon text-salmon" : "text-cream-deep"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-grey">{format(new Date(r.created_at), "MMM yyyy")}</p>
                </div>
                {r.comment && <p className="mt-3 text-sm text-pitch-black">{r.comment}</p>}
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterReviewsAll;
