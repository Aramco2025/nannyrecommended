import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-off-white">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-slate-grey">
            Babysitters and nannies, recommended by people you trust. Built for parents in the UK and UAE.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-pitch-black">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-grey">
            <li><Link to="/sitters" className="hover:text-pitch-black">Find a sitter</Link></li>
            <li><Link to="/pricing" className="hover:text-pitch-black">Pricing</Link></li>
            <li><Link to="/how-it-works" className="hover:text-pitch-black">How it works</Link></li>
            <li><Link to="/sitter/signup" className="hover:text-pitch-black">Become a sitter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-pitch-black">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-grey">
            <li>About</li>
            <li>Help</li>
            <li>Trust & safety</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-slate-grey sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} NannyRecommended. UK & UAE.</span>
          <span>You only pay for what you book.</span>
        </div>
      </div>
    </footer>
  );
}
