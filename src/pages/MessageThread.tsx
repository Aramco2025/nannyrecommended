import { useState, useEffect, useRef } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useThreadMessages, sendMessage } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ThreadSafetyBanner } from "@/components/messaging/ThreadSafetyBanner";
import { ContactWarningDialog } from "@/components/messaging/ContactWarningDialog";
import { detectContactRisk } from "@/lib/messaging/safety";

const MessageThread = () => {
  const { bookingId } = useParams();
  const { user, loading } = useAuth();
  const { messages, loading: msgsLoading } = useThreadMessages(bookingId);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState<{ sitterName: string; parentId: string } | null>(null);
  const [warning, setWarning] = useState<{ reasons: string[] } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookingId) return;
    supabase.from("bookings").select("parent_id, sitters(full_name)").eq("id", bookingId).maybeSingle()
      .then(({ data }) => data && setMeta({ sitterName: (data.sitters as any)?.full_name ?? "Sitter", parentId: data.parent_id }));
  }, [bookingId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const doSend = async () => {
    if (!text.trim() || !bookingId) return;
    setBusy(true);
    try {
      await sendMessage(bookingId, text.trim());
      setText("");
      setWarning(null);
    } catch (e: any) {
      toast({ title: "Couldn't send", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    if (!text.trim()) return;
    const risk = detectContactRisk(text);
    if (risk.level === "hard") {
      setWarning({ reasons: risk.reasons });
      return;
    }
    void doSend();
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <div className="border-b border-cream-deep bg-pure-white">
        <div className="container flex items-center gap-3 py-3">
          <Link to="/messages" className="text-slate-grey hover:text-pitch-black"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="flex-1">
            <div className="font-semibold text-pitch-black">{meta?.sitterName ?? "Conversation"}</div>
          </div>
        </div>
      </div>

      <main className="container flex-1 space-y-3 py-4">
        <ThreadSafetyBanner bookingId={bookingId} />
        {msgsLoading ? (
          <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="space-y-2">
            {messages.map((m: any) => {
              const mine = m.sender_id === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine ? "bg-salmon-soft text-pitch-black" : "bg-pure-white text-pitch-black shadow-card"
                  }`}>
                    {m.body}
      </div>

      <ContactWarningDialog
        open={!!warning}
        reasons={warning?.reasons ?? []}
        onCancel={() => setWarning(null)}
        onConfirm={() => void doSend()}
      />
    </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-cream-deep bg-pure-white p-3">
        <div className="container flex items-center gap-2">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Write a message"
            maxLength={2000}
          />
          <Button onClick={send} disabled={busy || !text.trim()} size="icon" className="bg-salmon hover:bg-salmon-deep">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
