import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Baby, Moon, Stethoscope, Sparkles, Dog, Home as HomeIcon,
  PawPrint, Bone, Brush, GraduationCap, PartyPopper, MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Item = {
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  comingSoon?: boolean;
};

const childcare: Item[] = [
  { label: "One-off sit", desc: "A specific date & time", icon: Baby, to: "/parent/post-job?type=one_off" },
  { label: "Repeat / regular", desc: "Same day each week", icon: HomeIcon, to: "/parent/post-job?type=repeat" },
  { label: "Nanny agency", desc: "Concierge-matched nanny", icon: Sparkles, to: "/parent/post-job?type=permanent" },
  { label: "Night nanny", desc: "Overnight newborn support", icon: Moon, to: "/parent/post-job?type=one_off&care=night" },
  { label: "Concierge", desc: "We do the matching for you", icon: Stethoscope, comingSoon: true },
];

const petcare: Item[] = [
  { label: "Dog walker", desc: "30–60 min walks", icon: Dog, comingSoon: true },
  { label: "Pet sitter", desc: "At your home", icon: PawPrint, comingSoon: true },
  { label: "Pet boarding", desc: "At the sitter's home", icon: HomeIcon, comingSoon: true },
  { label: "Drop-in visit", desc: "Feed, refresh water, play", icon: Bone, comingSoon: true },
];

const tasks: Item[] = [
  { label: "Cleaning", desc: "One-off or weekly", icon: Brush, comingSoon: true },
  { label: "Tutoring", desc: "Primary, secondary, exam prep", icon: GraduationCap, comingSoon: true },
  { label: "Party help", desc: "Extra hands for the day", icon: PartyPopper, comingSoon: true },
  { label: "Other", desc: "Tell us what you need", icon: MoreHorizontal, comingSoon: true },
];

function Card({ item }: { item: Item }) {
  const inner = (
    <div className={`group relative flex h-full items-center gap-4 rounded-2xl bg-pure-white p-5 shadow-card transition-all ${item.comingSoon ? "opacity-70" : "hover:-translate-y-0.5 hover:shadow-card-hover"}`}>
      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep">
        <item.icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-bold text-pitch-black">{item.label}</h3>
          {item.comingSoon && (
            <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-grey">Soon</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-grey">{item.desc}</p>
      </div>
      {!item.comingSoon && (
        <ArrowRight className="h-4 w-4 text-slate-grey transition-transform group-hover:translate-x-1 group-hover:text-pitch-black" />
      )}
    </div>
  );
  if (item.comingSoon || !item.to) return inner;
  return <Link to={item.to}>{inner}</Link>;
}

export default function PostJobStart() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-10">
        <button onClick={() => nav(-1)} className="mb-6 text-sm font-medium text-slate-grey hover:text-pitch-black">
          ← Back
        </button>
        <h1 className="font-display text-3xl font-bold tracking-tight text-pitch-black md:text-4xl">
          What do you need help with?
        </h1>
        <p className="mt-2 text-sm text-slate-grey">
          Pick a category and we'll send your request to verified sitters near you.
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-salmon-deep">Childcare</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {childcare.map(i => <Card key={i.label} item={i} />)}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-salmon-deep">Petcare</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {petcare.map(i => <Card key={i.label} item={i} />)}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-salmon-deep">Tasks</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tasks.map(i => <Card key={i.label} item={i} />)}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-slate-grey">
          Need something else?{" "}
          <Link to="/contact" className="font-semibold text-salmon-deep hover:underline">Contact us</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
