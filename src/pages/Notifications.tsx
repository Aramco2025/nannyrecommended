import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { Loader2, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";

export default function Notifications() {
  const { user, loading } = useAuth();
  const { data, isLoading, refetch } = useNotifications();
  const mark = useMarkNotificationRead();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const items = data ?? [];
  const unread = items.filter(n => !n.read_at).length;

  const markAll = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);
    if (error) return toast.error(error.message);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black">Notifications</h1>
            <p className="mt-1 text-sm text-slate-grey">{unread} unread</p>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAll}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {isLoading && <div className="grid h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          {!isLoading && items.length === 0 && (
            <EmptyState
              icon={<Bell className="h-5 w-5" />}
              title="You're all caught up"
              description="New booking updates and messages will land here."
            />
          )}
          {items.map(n => {
            const Wrapper: any = n.link ? Link : "div";
            const wrapperProps = n.link ? { to: n.link } : {};
            return (
              <Wrapper
                key={n.id}
                {...wrapperProps}
                onClick={() => { if (!n.read_at) mark.mutate(n.id); }}
                className={`block rounded-2xl border p-4 transition ${
                  n.read_at ? "border-border bg-card" : "border-salmon/40 bg-salmon-soft/30 hover:bg-salmon-soft/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-pitch-black">{n.title}</div>
                    {n.body && <div className="mt-0.5 text-sm text-slate-grey">{n.body}</div>}
                  </div>
                  <div className="shrink-0 text-[11px] text-slate-grey">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
