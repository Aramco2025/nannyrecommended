import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";

type NextBooking = {
  id: string;
  start_at: string;
  end_at: string;
  hours: number;
  total_aed: number;
  status: string;
  address?: string | null;
  sitters?: { full_name: string | null; photos: string[] | null } | null;
};

type Props = { booking: NextBooking | null };

function countdown(target: Date): string {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return "Happening now";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `in ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `in ${hrs} hr${hrs === 1 ? "" : "s"}`;
  const days = Math.round(hrs / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

export function NextBookingCard({ booking }: Props) {
  if (!booking) {
    return (
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-6 text-pitch-black shadow-card md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">
              Nothing booked
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              Plan your next sit
            </h2>
            <p className="mt-1 text-sm text-slate-grey">
              Browse verified sitters in your area or book a sit and let them apply.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
              <Link to="/sitters">Find a sitter <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-pitch-black/15 bg-transparent text-pitch-black hover:bg-pitch-black/5">
              <Link to="/parent/post-job/start">Book a sit</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const start = new Date(booking.start_at);
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="overflow-hidden rounded-3xl bg-pitch-black p-6 text-pure-white shadow-card md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-salmon">
            Next sit · {countdown(start)}
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            With {booking.sitters?.full_name?.split(" ")[0] ?? "your sitter"}
          </h2>
        </div>
        {booking.sitters?.photos?.[0] && (
          <img
            src={booking.sitters.photos[0]}
            alt=""
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-pure-white/20"
          />
        )}
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <Fact icon={Calendar} label={dateFmt.format(start)} />
        <Fact icon={Clock} label={`${booking.hours} hour${booking.hours === 1 ? "" : "s"} · ${formatCurrency(Number(booking.total_aed))}`} />
        <Fact icon={MapPin} label={booking.address?.split(",")[0] || "At your home"} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
          <Link to={`/bookings/${booking.id}`}>View booking <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-pure-white/20 bg-transparent text-pure-white hover:bg-pure-white/10 hover:text-pure-white">
          <Link to={`/messages/${booking.id}`}>
            <MessageCircle className="h-4 w-4" /> Message sitter
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label }: { icon: typeof Calendar; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-pure-white/5 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-salmon" />
      <span className="truncate text-pure-white/90">{label}</span>
    </div>
  );
}
