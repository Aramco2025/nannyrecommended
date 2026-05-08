import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EarningsCalculator } from "@/components/sitter/EarningsCalculator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const SitterCalculator = () => {
  const [rate, setRate] = useState(75);
  return (
    <div className="min-h-screen bg-cream pb-20">
      <Header />
      <main className="container max-w-2xl py-8">
        <Link to="/sitter/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
          <ChevronLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-pitch-black">Earnings calculator</h1>
        <p className="mt-1 text-sm text-slate-grey">See what you could take home each month on NannyRecommended.</p>

        <div className="mt-6 rounded-2xl bg-pure-white p-6 shadow-card">
          <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">
            Your hourly rate
          </Label>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pitch-black">AED {rate}</span>
            <span className="text-xs text-slate-grey">/ hour</span>
          </div>
          <Slider value={[rate]} min={30} max={300} step={5} onValueChange={(v) => setRate(v[0])} />
        </div>

        <div className="mt-6">
          <EarningsCalculator hourlyRate={rate} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterCalculator;
