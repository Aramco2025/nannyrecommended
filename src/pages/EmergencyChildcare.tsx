import { Zap } from "lucide-react";
import { CareTypePage } from "@/components/CareTypePage";

const EmergencyChildcare = () => (
  <CareTypePage
    eyebrow="Emergency childcare"
    title="Last-minute care,"
    italic="when life happens"
    intro="Sick days, work emergencies, cancelled plans — find a verified sitter in as little as 30 minutes."
    searchHref="/sitters?available=now"
    icon={Zap}
    rate="AED 50/hr"
    bullets={[
      "Same-day and same-hour booking",
      "‘Available now’ filter shows ready sitters",
      "Reference-checked even at short notice",
      "In-app messaging for fast confirmation",
      "Insurance included on every booking",
    ]}
    steps={[
      { title: "Filter ‘Available now’", desc: "See sitters who are free in the next few hours, near you." },
      { title: "Message instantly", desc: "Most sitters reply in under 10 minutes during the day." },
      { title: "Book and breathe", desc: "Confirm and pay in-app — they're on the way." },
    ]}
    faqs={[
      { q: "How fast can I get a sitter?", a: "In Dubai and Abu Dhabi most parents have a confirmed sitter within 30–60 minutes during the day." },
      { q: "Is it more expensive last-minute?", a: "Sitters set their own rates. Some charge a small last-minute premium — always shown upfront before you confirm." },
      { q: "Are emergency sitters checked too?", a: "Yes — every sitter on the platform passes the same checks, regardless of how quickly you book." },
      { q: "What if no one is available?", a: "Family Plus members get concierge support — message us and we'll personally source someone for you." },
    ]}
  />
);

export default EmergencyChildcare;
