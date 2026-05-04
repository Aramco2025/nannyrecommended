import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-off-white">
      <div className="container grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2 space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-slate-grey">
            Babysitters and nannies, recommended by people you trust. Built for parents across the UAE.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-pitch-black">Find childcare</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-grey">
            <li><Link to="/sitters?type=babysitter" className="hover:text-pitch-black">Babysitter</Link></li>
            <li><Link to="/find-nanny" className="hover:text-pitch-black">Find a nanny</Link></li>
            <li><Link to="/sitters?type=night-nanny" className="hover:text-pitch-black">Night nanny</Link></li>
            <li><Link to="/sitters?type=after-school" className="hover:text-pitch-black">After-school nanny</Link></li>
            <li><Link to="/sitters?type=nanny" className="hover:text-pitch-black">Full-time nanny</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-pitch-black">For sitters</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-grey">
            <li><Link to="/sitter/signup" className="hover:text-pitch-black">Become a sitter</Link></li>
            <li><Link to="/nanny-jobs" className="hover:text-pitch-black">Nanny jobs</Link></li>
            <li><Link to="/guides" className="hover:text-pitch-black">Sitter guides</Link></li>
            <li><Link to="/pricing" className="hover:text-pitch-black">Pricing</Link></li>
            <li><Link to="/how-it-works" className="hover:text-pitch-black">How it works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-pitch-black">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-grey">
            <li><Link to="/about" className="hover:text-pitch-black">About us</Link></li>
            <li><Link to="/trust-safety" className="hover:text-pitch-black">Trust & safety</Link></li>
            <li><Link to="/guides" className="hover:text-pitch-black">Guides</Link></li>
            <li><Link to="/contact" className="hover:text-pitch-black">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-pitch-black">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-pitch-black">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-slate-grey sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} NannyRecommended. UAE.</span>
          <span>You only pay for what you book.</span>
        </div>
      </div>
    </footer>
  );
}
