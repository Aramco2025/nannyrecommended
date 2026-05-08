import { useState } from "react";
import { Bell, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function NewInAreaCard({ count, area }: { count: number; area?: string | null }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Add a valid email", variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "We'll let you know", description: `New sitters in ${area || "your area"} will be sent to ${email}.` });
  };

  return (
    <div className="mb-6 rounded-2xl border border-cream-deep bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pure-white text-salmon-deep shadow-card">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold text-pitch-black">
            We're new in {area || "your area"}
          </h3>
          <p className="mt-1 text-xs text-slate-grey">
            Only {count} verified sitter{count === 1 ? "" : "s"} so far. Get notified the moment a great match joins — and we'll prioritise your area for outreach.
          </p>
          {done ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-success-green">
              <Check className="h-4 w-4" /> You're on the list
            </p>
          ) : (
            <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 rounded-full bg-pure-white text-sm"
              />
              <Button type="submit" size="sm" className="rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <Bell className="mr-1 h-3.5 w-3.5" /> Notify me
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
