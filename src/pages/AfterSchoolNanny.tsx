import { GraduationCap } from "lucide-react";
import { CareTypePage } from "@/components/CareTypePage";

const AfterSchoolNanny = () => (
  <CareTypePage
    eyebrow="After-school nanny"
    title="School pick-up,"
    italic="sorted"
    intro="Reliable after-school cover — pick-ups, snacks, homework help and activities until you're home."
    searchHref="/sitters?type=after-school"
    icon={GraduationCap}
    rate="AED 55/hr"
    bullets={[
      "School pick-up included",
      "Healthy snacks and dinner prep",
      "Homework help and reading time",
      "Drop-off at clubs and playdates",
      "Regular weekly schedule or ad-hoc",
    ]}
    steps={[
      { title: "Tell us your school run", desc: "Share your school, hours and any clubs your child attends." },
      { title: "Match with a local sitter", desc: "We shortlist sitters near your school or home with the right driving setup." },
      { title: "Settle into a routine", desc: "Trial week recommended. Loyalty fee drops as you re-book." },
    ]}
    faqs={[
      { q: "Does the nanny need to drive?", a: "Most after-school sitters in the UAE drive. You can filter by ‘Driver’ when browsing." },
      { q: "What hours are typical?", a: "Usually 2pm–6pm or 3pm–7pm, Monday to Thursday or Sunday to Thursday." },
      { q: "Can the nanny help with homework?", a: "Yes — many of our after-school nannies have teaching or tutoring backgrounds. Check profiles." },
      { q: "What about school holidays?", a: "You can extend hours or book holiday cover separately. Same sitter, same trust." },
    ]}
  />
);

export default AfterSchoolNanny;
