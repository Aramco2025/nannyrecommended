import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { articleBySlug } from "@/lib/education/articles";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";

const EducationArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articleBySlug(slug ?? "");
  if (!article) return <Navigate to="/sitter/education" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1 text-slate-grey">
          <Link to="/sitter/education"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        </Button>
        <article className="rounded-3xl bg-pure-white p-6 shadow-card md:p-10">
          <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">{article.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-grey">
            <Clock className="h-3 w-3" /> {article.readingMins} min read
          </p>
          <div className="prose prose-sm mt-6 max-w-none text-pitch-black">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 whitespace-pre-line text-base leading-relaxed text-pitch-black"
                 dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default EducationArticle;
