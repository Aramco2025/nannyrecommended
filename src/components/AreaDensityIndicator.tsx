import { useState } from "react";
import { Loader2, Sparkles, MapPin, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAreaDensity } from "@/hooks/useAreaDensity";

type Props = {
  area: string | null | undefined;
  /** Total currently visible to the user after filters — used for the explainer. */
  visibleCount: number;
};

/**
 * Cold-start defence: when an area has fewer than 5 active sitters, we tell
 * the truth instead of pretending. We also offer:
 *   - a waitlist signup (so users feel heard, not abandoned)
 *   - an honest signal of momentum if recent sitters joined
 */
export function AreaDensityIndicator({ area, visibleCount }: Props) {
  const density = useAreaDensity(area);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  if (density.loading) return null;
  // Healthy area — no banner needed
  if (density.level === "hot" && visibleCount >= 5) return null;

  const isCold = density.level === "cold";
  const label =
    density.level === "cold"
      ? "Early-access area"
      : density.level === "warm"
      ? "Growing network"
      : "Limited results";

  const submit = async () => {
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    setBusy(true);
    const { error } = await supabase.from("area_waitlist").insert({
      area: area ?? "Any",
      email: email.trim().toLowerCase(),
      user_id: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("You're on the list — we'll email when more sitters join.");
    setOpen(false);
    setEmail("");
  };

  return (
    <section
      aria-label="Area availability"
      className={`mb-5 rounded-2xl border p-4 ${
        isCold
          ? "border-salmon/40 bg-salmon/5"
          : "border-border bg-cream"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pure-white">
          <MapPin className="h-4 w-4 text-salmon-deep" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pure-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-salmon-deep">
              {label}
            </span>
            {density.growingFast && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-green/10 px-2 py-0.5 text-[10px] font-semibold text-success-green">
                <TrendingUp className="h-3 w-3" /> Growing fast
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold text-pitch-black">
            {density.totalActive === 0
              ? `No sitters listed in ${area || "this area"} yet`
              : `${density.totalActive} active sitter${density.totalActive === 1 ? "" : "s"}${area ? ` in ${area}` : ""}`}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-grey">
            {isCold
              ? "We don't fake supply. Join the waitlist and we'll email the moment a vetted sitter lists in your area — usually within 1–2 weeks."
              : "Your filters narrowed results. Try widening the rate range, or join the waitlist for new arrivals in your area."}
          </p>

          {!open ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 gap-1.5"
              onClick={() => setOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5" /> Notify me when sitters join
            </Button>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={user?.email ?? ""}
                required
                className="bg-pure-white"
              />
              <Button type="submit" disabled={busy} className="bg-salmon hover:bg-salmon-deep text-primary-foreground">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Notify me"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
