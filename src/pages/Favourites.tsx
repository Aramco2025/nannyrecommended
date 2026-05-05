import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { SitterCard } from "@/components/SitterCard";
import { useFavourites } from "@/hooks/useFavourites";
import { useSitters } from "@/hooks/useSitters";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Favourites = () => {
  const { user, loading } = useAuth();
  const { data: favIds, isLoading: favLoading } = useFavourites();
  const { data: sitters = [], isLoading: sittersLoading } = useSitters();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const favs = sitters
    .filter(s => favIds?.has(s.id))
    .sort((a, b) => (b.bookingsCompleted ?? 0) - (a.bookingsCompleted ?? 0));
  const isLoading = favLoading || sittersLoading;

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />
      <main className="container py-8">
        <div className="mb-6 flex items-center gap-3">
          <Heart className="h-6 w-6 fill-salmon text-salmon" />
          <h1 className="font-display text-2xl font-bold text-pitch-black md:text-3xl">Your favourites</h1>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-grey">Loading…</div>
        ) : favs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-deep bg-pure-white p-10 text-center">
            <Heart className="mx-auto mb-3 h-8 w-8 text-slate-grey" />
            <h3 className="font-display text-lg font-bold text-pitch-black">No favourites yet</h3>
            <p className="mt-2 text-sm text-slate-grey">
              Tap the heart on any sitter's card to save them to your shortlist.
            </p>
            <Button asChild className="mt-4 bg-salmon text-pure-white hover:bg-salmon-deep">
              <Link to="/sitters">Browse sitters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map(s => <SitterCard key={s.id} sitter={s} />)}
          </div>
        )}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default Favourites;
