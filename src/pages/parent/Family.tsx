import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useChildren, useDeleteChild, type Child } from "@/hooks/useChildren";
import { ChildEditor } from "@/components/parent/ChildEditor";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Users } from "lucide-react";
import { differenceInYears, parseISO, format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

const ParentFamily = () => {
  const { user, loading } = useAuth();
  const { data: children, isLoading } = useChildren();
  const del = useDeleteChild();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">My family</h1>
            <p className="mt-1 text-sm text-slate-grey">Sitters see this when you book or post a job.</p>
          </div>
          <ChildEditor />
        </div>

        {isLoading ? (
          <div className="mt-10 grid min-h-[200px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (children ?? []).length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-cream-deep bg-pure-white p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-grey" />
            <h2 className="mt-3 font-display text-lg font-bold text-pitch-black">No children added yet</h2>
            <p className="mt-1 text-sm text-slate-grey">Add ages and notes so sitters arrive prepared.</p>
            <div className="mt-4 inline-flex"><ChildEditor /></div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(children ?? []).map((c: Child) => (
              <article key={c.id} className="rounded-3xl bg-pure-white p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-salmon-soft font-display text-base font-bold text-salmon-deep">
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-pitch-black">{c.name}</h3>
                    <p className="text-xs text-slate-grey">
                      {c.dob ? `${differenceInYears(new Date(), parseISO(c.dob))} years · born ${format(parseISO(c.dob), "MMM yyyy")}` : "Age not set"}
                    </p>
                  </div>
                </div>
                {c.notes && <p className="mt-3 line-clamp-3 rounded-2xl bg-cream p-3 text-sm text-pitch-black">{c.notes}</p>}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-cream-deep pt-3">
                  <Button
                    size="sm" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={async () => {
                      if (!confirm(`Remove ${c.name}?`)) return;
                      try { await del.mutateAsync(c.id); toast({ title: "Removed" }); }
                      catch (e: any) { toast({ title: "Couldn't remove", description: e.message, variant: "destructive" }); }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                  <ChildEditor child={c} trigger={<Button size="sm" variant="outline" className="rounded-full">Edit</Button>} />
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-grey">
            <Link to="/account">← Back to account</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentFamily;
