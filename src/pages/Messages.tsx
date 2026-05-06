import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyThreads } from "@/hooks/useMessages";
import { Loader2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/EmptyState";

const Messages = () => {
  const { user, loading } = useAuth();
  const { data: threads, isLoading } = useMyThreads();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-2xl py-8">
        <h1 className="font-display text-3xl font-bold text-pitch-black">Inbox</h1>
        <p className="mt-1 text-sm text-slate-grey">Conversations linked to your bookings.</p>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (threads ?? []).length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-5 w-5" />}
              title="No conversations yet"
              description="Once you book a sitter, your messages will appear here."
              ctaLabel="Find a sitter"
              ctaTo="/sitters"
            />
          ) : (
            (threads ?? []).map((t: any) => (
              <Link
                key={t.id}
                to={`/messages/${t.id}`}
                className="flex items-center gap-4 rounded-2xl bg-pure-white p-4 shadow-card transition hover:shadow-card-hover"
              >
                <div className="h-12 w-12 overflow-hidden rounded-full bg-salmon-soft">
                  {t.sitters?.photos?.[0] && <img src={t.sitters.photos[0]} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-pitch-black">{t.sitters?.full_name ?? "Sitter"}</div>
                  <div className="text-xs text-slate-grey">{format(new Date(t.start_at), "EEE do MMM, h:mma")} · {t.status}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
