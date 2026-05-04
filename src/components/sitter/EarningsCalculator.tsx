import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { tierFromHourlyRate, getTier } from "@/lib/pricing/tiers";

export function EarningsCalculator({ hourlyRate }: { hourlyRate: number }) {
  const [hours, setHours] = useState(80);
  const tier = getTier(tierFromHourlyRate(hourlyRate));
  const gross = hourlyRate * hours;
  const fee = Math.round(gross * 0.04);
  const takeHome = gross - fee;
  const ftMidpoint = Math.round((tier.monthlyFullTimeRange[0] + tier.monthlyFullTimeRange[1]) / 2);
  const diff = takeHome - ftMidpoint;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="text-sm font-semibold text-pitch-black">💰 What you could earn</div>
      <div className="mt-3 text-xs text-slate-grey">At AED {hourlyRate}/hr × {hours} hours per month:</div>
      <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
        <Row label="Gross earnings" value={`AED ${gross.toLocaleString()}`} />
        <Row label="Platform fee (4%)" value={`AED ${fee.toLocaleString()}`} />
        <div className="my-2 border-t border-border" />
        <Row label={<span className="font-semibold text-pitch-black">You take home</span>} value={<span className="font-semibold text-pitch-black">AED {takeHome.toLocaleString()}</span>} />
      </div>
      {diff > 0 && (
        <p className="mt-3 text-xs text-slate-grey">
          That's <span className="font-semibold text-success-green">AED {diff.toLocaleString()} more</span> than the typical full-time live-out salary at your tier.
        </p>
      )}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-grey">
          <span>Adjust hours</span><span className="font-medium text-pitch-black">{hours} hrs/month</span>
        </div>
        <Slider value={[hours]} min={10} max={200} step={5} onValueChange={(v) => setHours(v[0])} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="flex items-center justify-between text-sm text-slate-grey"><span>{label}</span><span>{value}</span></div>;
}
