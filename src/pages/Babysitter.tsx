import { Baby } from "lucide-react";
import { CareTypePage } from "@/components/CareTypePage";

const Babysitter = () => (
  <CareTypePage
    eyebrow="Babysitter"
    title="A trusted babysitter,"
    italic="just around the corner"
    intro="Date nights, work events, weekend errands — find a reference-checked babysitter near you in minutes."
    searchHref="/sitters?type=babysitter"
    icon={Baby}
    rate="AED 45/hr"
    bullets={[
      "One-off and last-minute bookings welcome",
      "Evenings, weekends and holidays",
      "Free meet-and-greet before your first sit",
      "Pay securely in-app, no cash needed",
      "Real reviews from UAE parents",
    ]}
    steps={[
      { title: "Find a sitter", desc: "Browse profiles, read reviews and shortlist sitters in your area." },
      { title: "Message & meet", desc: "Chat freely, ask questions and book a free meet-and-greet." },
      { title: "Book & relax", desc: "Confirm dates and pay in-app. Insurance included on every sit." },
    ]}
    faqs={[
      { q: "How much does a babysitter cost in the UAE?", a: "Most sitters charge AED 40–70 per hour depending on experience, qualifications and the number of children." },
      { q: "Can I book a sitter for tonight?", a: "Yes — many sitters accept same-day requests. Look for the ‘Available tonight’ badge on profiles." },
      { q: "Do I need to provide anything?", a: "Just a quick brief on your kids' routine, snacks and emergency contacts. We send a checklist before each sit." },
      { q: "What if my plans change?", a: "Free cancellation up to 24 hours before the sit (6 hours on Family Plus)." },
    ]}
  />
);

export default Babysitter;
