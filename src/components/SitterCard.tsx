import { Link } from "react-router-dom";
import { Star, MapPin, MessageCircle, ShieldCheck, Heart, ThumbsUp, Users, PlayCircle } from "lucide-react";
import { UISitter } from "@/lib/sitterMapper";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { TierBadge } from "@/components/pricing/TierBadge";
import { useFavourites, useToggleFavourite } from "@/hooks/useFavourites";
import { useTrustCount } from "@/hooks/useFriends";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { CompareToggle } from "@/components/sitters/CompareDrawer";
import { ActivitySignal } from "@/components/sitters/ActivitySignal";

export function SitterCard({ sitter }: { sitter: UISitter }) {
  const { user } = useAuth();
  const { data: favs } = useFavourites();
  const toggleFav = useToggleFavourite();
  const { data: trustCount = 0 } = useTrustCount(sitter.id);
  const isFav = favs?.has(sitter.id) ?? false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link to={`/sitters/${sitter.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={sitter.photo}
          alt={sitter.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {sitter.verified && (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-pure-white/95 px-2 py-1 text-[11px] font-semibold text-pitch-black shadow-card backdrop-blur">
            <ShieldCheck className="h-3 w-3 text-success-green" /> Verified
          </span>
        )}
        {sitter.hasVideoIntro && (
          <span className="absolute left-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-pitch-black/85 px-2 py-1 text-[11px] font-semibold text-pure-white shadow-card backdrop-blur">
            <PlayCircle className="h-3 w-3" /> Video intro
          </span>
        )}
      </Link>
      <CompareToggle sitter={sitter} />

      {user && (
        <button
          type="button"
          aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav.mutate({ sitterId: sitter.id, isFav }); }}
          className="absolute left-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pure-white/90 shadow-card backdrop-blur transition hover:scale-105"
        >
          <Heart className={cn("h-4 w-4 transition", isFav ? "fill-salmon text-salmon" : "text-slate-grey")} />
        </button>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/sitters/${sitter.id}`}>
              <h3 className="truncate text-base font-semibold text-pitch-black hover:text-salmon-deep">{sitter.name}</h3>
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-grey">
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5 text-success-green" />
                <span className="font-medium text-pitch-black">{sitter.rating ? `${Math.round(sitter.rating * 20)}%` : "New"}</span>
              </span>
              {sitter.bookingsCompleted > 0 && (
                <span>{sitter.bookingsCompleted} sits</span>
              )}
              {sitter.yearsExperience > 0 && (
                <span>{sitter.yearsExperience}y exp</span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {sitter.area}
              </span>
            </div>
            {trustCount > 0 && (
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-pitch-black">
                <Users className="h-3 w-3 text-salmon" />
                Trusted by {trustCount} friend{trustCount === 1 ? "" : "s"}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-pitch-black">
              {formatCurrency(sitter.hourlyRate, sitter.currency)}
            </div>
            <div className="text-[11px] text-slate-grey">per hour</div>
            {sitter.tier && <div className="mt-1 flex justify-end"><TierBadge tier={sitter.tier} /></div>}
          </div>
        </div>

        {sitter.headline && (
          <p className="line-clamp-2 text-xs text-slate-grey">{sitter.headline}</p>
        )}

        <ActivitySignal lastActiveAt={sitter.lastActiveAt} avgResponseMinutes={sitter.avgResponseMinutes} compact />

        {(() => {
          const quals: string[] = [];
          if (sitter.firstAidCertified) quals.push("First aid");
          if (sitter.policeCleared) quals.push("Police cleared");
          if (sitter.earlyYearsQualified) quals.push("Early years");
          if (sitter.teachingQualified) quals.push("Teaching");
          if (sitter.newbornExperience) quals.push("Newborn");
          if (sitter.senExperience) quals.push("SEN");
          const top = quals.slice(0, 3);
          return top.length === 0 ? null : (
            <div className="flex flex-wrap gap-1.5">
              {top.map(q => (
                <span key={q} className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-pitch-black">{q}</span>
              ))}
            </div>
          );
        })()}
        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <MessageCircle className="h-4 w-4" /> Message
          </Button>
          <Button asChild size="sm" className="flex-1 bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta">
            <Link to={`/book/${sitter.id}`}>Book</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
