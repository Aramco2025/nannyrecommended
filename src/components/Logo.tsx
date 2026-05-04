import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label="NannyRecommended home">
      <img src={logo} alt="NannyRecommended" className="h-16 w-auto md:h-20 lg:h-24" />
    </Link>
  );
}
