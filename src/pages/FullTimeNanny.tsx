import { Sun } from "lucide-react";
import { CareTypePage } from "@/components/CareTypePage";

const FullTimeNanny = () => (
  <CareTypePage
    eyebrow="Full-time nanny"
    title="Full-time care,"
    italic="full-time trust"
    intro="Permanent, professional nannies for UAE families — weekday daytime cover, live-out or live-in."
    searchHref="/sitters?type=nanny"
    icon={Sun}
    rate="AED 7,500/mo"
    bullets={[
      "40–50 hours per week",
      "Live-out or live-in arrangements",
      "Reference-checked and police-cleared",
      "Trial week recommended",
      "Help with employment paperwork on request",
    ]}
    steps={[
      { title: "Share your needs", desc: "Hours, ages, languages, driving — tell us what matters." },
      { title: "Meet shortlisted nannies", desc: "Free meet-and-greets with 2–3 strong candidates." },
      { title: "Trial and commit", desc: "Run a paid trial week before agreeing terms. We help you set things up." },
    ]}
    faqs={[
      { q: "How much does a full-time nanny cost in the UAE?", a: "Typically AED 6,500–10,000 per month for live-out, plus accommodation for live-in arrangements." },
      { q: "Can you help with visa sponsorship?", a: "We connect you with the nanny — you arrange employment terms directly. We can recommend trusted UAE agencies that handle sponsorship paperwork." },
      { q: "What's included in the trial week?", a: "A paid week so you and the nanny can confirm it's the right fit before signing a longer-term agreement." },
      { q: "Do nannies have a day off?", a: "Standard practice in the UAE is Friday or Saturday off, plus public holidays. You agree the schedule directly." },
    ]}
  />
);

export default FullTimeNanny;
