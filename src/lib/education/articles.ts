export type Article = {
  slug: string;
  title: string;
  category: "tips" | "safety" | "earnings" | "wellbeing";
  readingMins: number;
  excerpt: string;
  body: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "first-week-success",
    title: "Your first week as a sitter — what to expect",
    category: "tips",
    readingMins: 4,
    excerpt: "How to set up your profile, get your first booking, and turn it into a 5-star review.",
    body: `Your first week is about momentum. Start by completing every section of your profile — sitters with photos, video intros, and 3+ qualifications get booked 4× more often.\n\n**Day 1-2:** Add 3-5 photos of you, set your weekly availability, and write a warm bio (200+ words).\n\n**Day 3-4:** Apply to 5 jobs in your area, even if the timing isn't perfect — you can always negotiate.\n\n**Day 5-7:** When you do your first sit, focus on three things: arrive 10 minutes early, send the parent a photo update mid-sit, and tidy up before you leave.`,
  },
  {
    slug: "child-safety-essentials",
    title: "Child safety essentials every sitter should know",
    category: "safety",
    readingMins: 6,
    excerpt: "Allergies, choking hazards, water safety, and what to do in an emergency.",
    body: `Always confirm allergies and medications BEFORE the parent leaves. Save emergency numbers (DXB Police 999, ambulance 998) to your phone.\n\n**Choking:** For kids under 1, use 5 back blows + 5 chest thrusts. For older kids, abdominal thrusts.\n\n**Water:** Never leave a child unattended near a pool or bath, even for 10 seconds.\n\n**Sun:** UAE sun is intense — apply SPF 50+ every 2 hours and avoid 11am-3pm direct exposure.`,
  },
  {
    slug: "growing-your-earnings",
    title: "5 ways to grow your monthly earnings",
    category: "earnings",
    readingMins: 5,
    excerpt: "From specialising to bundling, the proven moves that increase what you take home.",
    body: `**1. Specialise.** Sitters with newborn or SEN experience charge 30-50% more. Add a course on your profile.\n\n**2. Bundle services.** Offer light housework or homework help — many parents will pay an extra AED 10-15/hr.\n\n**3. Build a regular client base.** One repeat family at 10hrs/week beats hunting one-off jobs.\n\n**4. Optimise your radius.** Set notifications for areas within 30 min — fewer commutes = more billable hours.\n\n**5. Get reviews.** Ask politely after every sit. Profiles with 10+ reviews get booked first.`,
  },
  {
    slug: "looking-after-yourself",
    title: "Looking after yourself between sits",
    category: "wellbeing",
    readingMins: 3,
    excerpt: "Caregiving is rewarding but draining. Here's how the pros stay energised year-round.",
    body: `Set boundaries on hours and stick to them. Block time in your availability for rest. Drink water (UAE heat is no joke), and take a 10-minute walk between back-to-back sits.\n\nIf a sit goes badly, talk to our support team — we're here to help, and one tough family doesn't define your career.`,
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
