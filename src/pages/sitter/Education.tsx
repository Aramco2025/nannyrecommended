import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ARTICLES } from "@/lib/education/articles";
import { Clock, GraduationCap } from "lucide-react";

const CAT_LABEL: Record<string, string> = {
  tips: "Getting started",
  safety: "Safety",
  earnings: "Earnings",
  wellbeing: "Wellbeing",
};
const CAT_COLOR: Record<string, string> = {
  tips: "bg-salmon-soft text-salmon-deep",
  safety: "bg-red-100 text-red-700",
  earnings: "bg-emerald-100 text-emerald-700",
  wellbeing: "bg-blue-100 text-blue-700",
};

const Education = () => (
  <div className="min-h-screen bg-cream">
    <Header />
    <main className="container max-w-4xl py-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-salmon-soft text-salmon-deep">
          <GraduationCap className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">Education hub</h1>
          <p className="mt-1 text-sm text-slate-grey">Tips, safety, and growth — written for UAE sitters.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ARTICLES.map(a => (
          <Link key={a.slug} to={`/sitter/education/${a.slug}`} className="group block rounded-3xl bg-pure-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${CAT_COLOR[a.category]}`}>
              {CAT_LABEL[a.category]}
            </span>
            <h2 className="mt-3 font-display text-lg font-bold text-pitch-black group-hover:text-salmon-deep">{a.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-grey">{a.excerpt}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-grey">
              <Clock className="h-3 w-3" /> {a.readingMins} min read
            </p>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Education;
