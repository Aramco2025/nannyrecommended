import { Moon } from "lucide-react";
import { CareTypePage } from "@/components/CareTypePage";

const NightNanny = () => (
  <CareTypePage
    eyebrow="Night nanny"
    title="Sleep is"
    italic="a phone call away"
    intro="Specialist overnight support for newborns and infants — feeds, settling and full nights' sleep for you."
    searchHref="/sitters?type=night-nanny"
    icon={Moon}
    rate="AED 75/hr"
    bullets={[
      "Newborn and infant specialists",
      "Overnight shifts (typically 9pm–7am)",
      "Feeding, winding and settling",
      "Sleep training support if needed",
      "Detailed handover every morning",
    ]}
    steps={[
      { title: "Tell us your dates", desc: "Choose specific nights or an ongoing weekly schedule." },
      { title: "Match with a specialist", desc: "Our team shortlists night nannies experienced with babies your age." },
      { title: "Get your sleep back", desc: "Pay per night in-app. Cover up to AED 2,500 included on every booking." },
    ]}
    faqs={[
      { q: "What does a night nanny actually do?", a: "Settles the baby, handles night feeds (bottle or expressed milk), changes nappies and reports back in the morning. You sleep through." },
      { q: "How much does a night nanny cost in the UAE?", a: "Typically AED 70–100 per hour, or a flat night rate of AED 700–900 for a 10-hour shift." },
      { q: "From what age can I book?", a: "From birth. Many of our night nannies are also trained maternity nurses." },
      { q: "Can I book just one night?", a: "Yes — single nights or full weekly cover, your choice." },
    ]}
  />
);

export default NightNanny;
