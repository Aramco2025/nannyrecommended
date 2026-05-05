import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useDirectRequests, useRespondToRequest } from "@/hooks/useDirectRequests";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, MapPin, Wallet, Inbox, Check, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

const SitterRequests = () => {
  const { user, loading } = useAuth();
  const { data: requests, isLoading } = useDirectRequests();
  const respond = useRespondToRequest();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">Direct requests</h1>
            <p className="mt-1 text-sm text-slate-grey">Bookings parents have sent directly to you. Respond within 12 hours.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/sitter/dashboard">Back to dashboard</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-10 grid min-h-[200px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (requests ?? []).length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-cream-deep bg-pure-white p-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-slate-grey" />
            <h2 className="mt-3 font-display text-lg font-bold text-pitch-black">No requests right now</h2>
            <p className="mt-1 text-sm text-slate-grey">Keep your availability up to date so families can find you.</p>
            <Button asChild size="sm" className="mt-4 rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
              <Link to="/sitter/availability">Update availability</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {(requests ?? []).map((r: any) => {
              const start = new Date(r.start_at);
              const end = new Date(r.end_at);
              return (
                <article key={r.id} className="rounded-3xl bg-pure-white p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-base font-bold text-pitch-black">{format(start, "EEE do MMM")}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-grey">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-salmon" /> {format(start, "h:mma")}–{format(end, "h:mma")}</span>
                        {r.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-salmon" /> {r.address}</span>}
                        <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-salmon" /> AED {r.total_aed} total</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-grey">Sent {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  {r.notes && <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-pitch-black">{r.notes}</p>}
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-cream-deep pt-4">
                    <Button
                      variant="outline" size="sm" className="rounded-full" disabled={respond.isPending}
                      onClick={async () => {
                        try { await respond.mutateAsync({ bookingId: r.id, accept: false });
                          toast({ title: "Request declined" });
                        } catch (e: any) { toast({ title: "Couldn't decline", description: e.message, variant: "destructive" }); }
                      }}>
                      <X className="h-3.5 w-3.5" /> Decline
                    </Button>
                    <Button
                      size="sm" className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep" disabled={respond.isPending}
                      onClick={async () => {
                        try { await respond.mutateAsync({ bookingId: r.id, accept: true });
                          toast({ title: "Booking confirmed", description: "You're locked in for this sit." });
                        } catch (e: any) { toast({ title: "Couldn't accept", description: e.message, variant: "destructive" }); }
                      }}>
                      <Check className="h-3.5 w-3.5" /> Accept
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SitterRequests;
