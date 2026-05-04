import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { useFriends, useSendFriendRequest, useRespondFriendRequest } from "@/hooks/useFriends";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Check, X, Users } from "lucide-react";

const initials = (name: string | null) =>
  (name ?? "F").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const Friends = () => {
  const { user, loading } = useAuth();
  const { data: friends = [], isLoading } = useFriends();
  const send = useSendFriendRequest();
  const respond = useRespondFriendRequest();
  const [name, setName] = useState("");

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const accepted = friends.filter(f => f.status === "accepted");
  const incoming = friends.filter(f => f.status === "pending" && !f.iAmRequester);
  const outgoing = friends.filter(f => f.status === "pending" && f.iAmRequester);

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-salmon" />
          <h1 className="font-display text-2xl font-bold text-pitch-black md:text-3xl">Your parent network</h1>
        </div>
        <p className="mb-6 text-sm text-slate-grey">
          Connect with other parents to see which sitters they trust. Their favourites show up as "Trusted by friends" badges across the app.
        </p>

        <section className="mb-8 rounded-2xl bg-pure-white p-5 shadow-card">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-grey">Add a friend</Label>
          <form
            className="mt-2 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) send.mutate(name, { onSuccess: () => setName("") }); }}
          >
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Friend's full name (as on their profile)"
              maxLength={120}
            />
            <Button type="submit" disabled={!name.trim() || send.isPending} className="bg-salmon text-pure-white hover:bg-salmon-deep">
              <UserPlus className="mr-1 h-4 w-4" /> Send request
            </Button>
          </form>
        </section>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-grey">Loading…</div>
        ) : (
          <div className="space-y-8">
            {incoming.length > 0 && (
              <Section title="Pending requests">
                {incoming.map(f => (
                  <Row key={f.id} name={f.other_name} avatar={f.other_avatar}>
                    <Button size="sm" onClick={() => respond.mutate({ id: f.id, accept: true })} className="bg-success-green text-pure-white hover:bg-success-green/90">
                      <Check className="mr-1 h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => respond.mutate({ id: f.id, accept: false })}>
                      <X className="mr-1 h-4 w-4" /> Decline
                    </Button>
                  </Row>
                ))}
              </Section>
            )}

            <Section title={`Friends (${accepted.length})`}>
              {accepted.length === 0
                ? <p className="text-sm text-slate-grey">No friends connected yet.</p>
                : accepted.map(f => (
                  <Row key={f.id} name={f.other_name} avatar={f.other_avatar}>
                    <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: f.id, accept: false })} className="text-slate-grey">
                      Remove
                    </Button>
                  </Row>
                ))
              }
            </Section>

            {outgoing.length > 0 && (
              <Section title="Sent requests">
                {outgoing.map(f => (
                  <Row key={f.id} name={f.other_name} avatar={f.other_avatar}>
                    <span className="text-xs text-slate-grey">Awaiting reply</span>
                    <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: f.id, accept: false })} className="text-slate-grey">
                      Cancel
                    </Button>
                  </Row>
                ))}
              </Section>
            )}
          </div>
        )}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold text-pitch-black">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ name, avatar, children }: { name: string | null; avatar: string | null; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-pure-white p-3 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar><AvatarImage src={avatar ?? undefined} /><AvatarFallback>{initials(name)}</AvatarFallback></Avatar>
        <div className="font-semibold text-pitch-black">{name ?? "Parent"}</div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export default Friends;
