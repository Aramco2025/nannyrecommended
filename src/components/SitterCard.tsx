import { Link } from "react-router-dom";
import { Star, MapPin, Video, MessageCircle } from "lucide-react";
import { Sitter } from "@/data/sitters";
import { VerifiedBadge } from "./VerifiedBadge";
import { NetworkBadge } from "./NetworkBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";

export function SitterCard({ sitter }: { sitter: Sitter }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link to={`/sitters/${sitter.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={sitter.photo}
          alt={sitter.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {sitter.videoIntro && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-pitch-black/75 px-2 py-1 text-[11px] font-medium text-pure-white backdrop-blur">
            <Video className="h-3 w-3" /> Intro video
          </span>
        )}
        <span className="absolute right-3 top-3">
          <VerifiedBadge tier={sitter.verificationTier} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/sitters/${sitter.id}`}>
              <h3 className="text-base font-semibold text-pitch-black hover:text-salmon-deep">{sitter.name}</h3>
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-grey">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning-amber text-warning-amber" />
                <span className="font-medium text-pitch-black">{sitter.rating}</span>
                <span>({sitter.bookingsCompleted})</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {sitter.distanceKm} km
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-pitch-black">
              {formatCurrency(sitter.hourlyRate, sitter.currency)}
            </div>
            <div className="text-[11px] text-slate-grey">per hour</div>
          </div>
        </div>

        {sitter.recommendedBy && (
          <NetworkBadge text={`Recommended by ${sitter.recommendedBy}`} />
        )}

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
