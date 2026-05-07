import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Shield, Heart, Clock } from "lucide-react";

const slides = [
  { icon: Shield, title: "Vetted, trusted sitters", body: "Every sitter is ID-checked, reference-checked, and reviewed by other parents." },
  { icon: Heart, title: "Sitters your friends trust", body: "See who in your network has booked, favourited, or recommended a sitter." },
  { icon: Clock, title: "Book in minutes, not days", body: "Instant book a free slot, or book a sit and let sitters apply to you." },
];

export default function OnboardingWelcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream">
      <div className="container flex flex-col gap-8 py-10">
        <Logo />
        <div className="rounded-3xl bg-pure-white p-6 shadow-card md:p-10">
          <h1 className="text-3xl font-semibold text-pitch-black md:text-4xl">Childcare your family will love</h1>
          <p className="mt-2 text-slate-grey">A few things you should know before you start.</p>
          <ul className="mt-6 space-y-4">
            {slides.map((s) => (
              <li key={s.title} className="flex gap-4 rounded-2xl border border-cream-deep p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-salmon/15 text-salmon">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-pitch-black">{s.title}</p>
                  <p className="text-sm text-slate-grey">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-2">
            <Button size="lg" className="w-full bg-pitch-black text-pure-white hover:bg-pitch-black/90"
              onClick={() => navigate("/auth?mode=signup")}>Get started</Button>
            <Button asChild variant="ghost" size="lg" className="w-full">
              <Link to="/auth?mode=signin">I already have an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
