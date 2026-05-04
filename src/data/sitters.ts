export type Sitter = {
  id: string;
  name: string;
  photo: string;
  hourlyRate: number;
  currency: "AED";
  distanceKm: number;
  rating: number;
  bookingsCompleted: number;
  verificationTier: "basic" | "plus";
  videoIntro: boolean;
  recommendedBy?: string;
  recommendedByCount?: number;
  bio: string;
  responseTime: string;
  yearsExperience: number;
  qualifications: string[];
  languages: string[];
  ageGroups: string[];
  drives: boolean;
  firstAid: boolean;
  liveInAvailable?: boolean;
  visaType?: string;
  reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&h=600&fit=crop`;

export const sitters: Sitter[] = [
  {
    id: "sara-m",
    name: "Sara M.",
    photo: photo("photo-1494790108377-be9c29b29330"),
    hourlyRate: 75,
    currency: "AED",
    distanceKm: 0.8,
    rating: 4.9,
    bookingsCompleted: 142,
    verificationTier: "plus",
    videoIntro: true,
    recommendedBy: "Emma at Blossom Nursery JBR",
    recommendedByCount: 3,
    bio: "Former primary school teacher with 8 years of experience caring for children aged 0–10. I love arts and crafts, beach play, and reading bedtime stories with all the silly voices. Police-cleared and first-aid certified.",
    responseTime: "Usually within 1 hour",
    yearsExperience: 8,
    qualifications: ["Primary teacher (QTS)", "Paediatric first aid", "UAE police clearance"],
    languages: ["English", "Spanish"],
    ageGroups: ["0–1", "2–4", "5–10"],
    drives: true,
    firstAid: true,
    liveInAvailable: false,
    visaType: "Employment visa",
    reviews: [
      { id: "1", author: "Hannah B.", rating: 5, comment: "Sara was wonderful with our two. Came early, kitchen tidier than we left it, and the kids asked when she'd be back.", date: "2 weeks ago" },
      { id: "2", author: "Daniel K.", rating: 5, comment: "Calm, capable, brilliant with our autistic 6-year-old. Booked her again on the spot.", date: "1 month ago" },
    ],
  },
  {
    id: "leila-r",
    name: "Leila R.",
    photo: photo("photo-1438761681033-6461ffad8d80"),
    hourlyRate: 90,
    currency: "AED",
    distanceKm: 1.4,
    rating: 4.8,
    bookingsCompleted: 87,
    verificationTier: "plus",
    videoIntro: true,
    recommendedByCount: 1,
    recommendedBy: "James at DIFC",
    bio: "Paediatric nurse moonlighting as a sitter on weekends. Confident with newborns, allergies, and any medical questions you might have.",
    responseTime: "Usually within 30 minutes",
    yearsExperience: 5,
    qualifications: ["Paediatric nurse (DHA licensed)", "Advanced first aid", "UAE police clearance"],
    languages: ["English", "Arabic", "French"],
    ageGroups: ["0–1", "2–4"],
    drives: false,
    firstAid: true,
    liveInAvailable: true,
    visaType: "Residence visa",
    reviews: [
      { id: "1", author: "Priya S.", rating: 5, comment: "She just knows what she's doing. Total peace of mind.", date: "3 weeks ago" },
    ],
  },
  {
    id: "tom-w",
    name: "Tom W.",
    photo: photo("photo-1500648767791-00dcc994a43e"),
    hourlyRate: 65,
    currency: "AED",
    distanceKm: 2.1,
    rating: 4.7,
    bookingsCompleted: 54,
    verificationTier: "basic",
    videoIntro: false,
    bio: "Final year education student. Football, Lego, and getting kids actually excited about veg at dinner. Available evenings and weekends.",
    responseTime: "Usually within 2 hours",
    yearsExperience: 3,
    qualifications: ["Education BA (in progress)", "Basic first aid"],
    languages: ["English"],
    ageGroups: ["5–10", "11+"],
    drives: true,
    firstAid: true,
    visaType: "Student visa",
    reviews: [
      { id: "1", author: "Mark T.", rating: 5, comment: "Boys loved him. Worth every penny.", date: "1 week ago" },
    ],
  },
  {
    id: "amani-k",
    name: "Amani K.",
    photo: photo("photo-1544005313-94ddf0286df2"),
    hourlyRate: 80,
    currency: "AED",
    distanceKm: 2.8,
    rating: 4.9,
    bookingsCompleted: 211,
    verificationTier: "plus",
    videoIntro: true,
    recommendedByCount: 5,
    recommendedBy: "5 parents at GEMS Wellington",
    bio: "Twelve years as a nanny across Dubai families. Calm in a crisis, organised, and great with school runs. Long-term and one-off bookings welcome.",
    responseTime: "Usually within 1 hour",
    yearsExperience: 12,
    qualifications: ["NNEB", "UAE police clearance", "Paediatric first aid"],
    languages: ["English", "Swahili"],
    ageGroups: ["2–4", "5–10", "11+"],
    drives: true,
    firstAid: true,
    liveInAvailable: true,
    visaType: "Residence visa",
    reviews: [
      { id: "1", author: "Rebecca J.", rating: 5, comment: "Amani is part of the family now. Cannot recommend her highly enough.", date: "2 months ago" },
      { id: "2", author: "Olivia P.", rating: 5, comment: "Reliable, warm, and the kids adore her.", date: "3 months ago" },
    ],
  },
  {
    id: "yusra-a",
    name: "Yusra A.",
    photo: photo("photo-1573496359142-b8d87734a5a2"),
    hourlyRate: 70,
    currency: "AED",
    distanceKm: 3.2,
    rating: 4.6,
    bookingsCompleted: 31,
    verificationTier: "basic",
    videoIntro: true,
    bio: "Patient, gentle, and great at the bedtime wind-down. Specialise in evening sits.",
    responseTime: "Usually within 3 hours",
    yearsExperience: 2,
    qualifications: ["Childcare Level 2", "Basic first aid"],
    languages: ["English", "Urdu"],
    ageGroups: ["0–1", "2–4"],
    drives: false,
    firstAid: true,
    visaType: "Residence visa",
    reviews: [],
  },
  {
    id: "claire-d",
    name: "Claire D.",
    photo: photo("photo-1531123897727-8f129e1688ce"),
    hourlyRate: 85,
    currency: "AED",
    distanceKm: 3.9,
    rating: 4.8,
    bookingsCompleted: 96,
    verificationTier: "plus",
    videoIntro: false,
    bio: "Nursery nurse weekdays, sitter on weekends. Crafty, energetic, and unafraid of the dunes.",
    responseTime: "Usually within 1 hour",
    yearsExperience: 6,
    qualifications: ["NNEB", "UAE police clearance"],
    languages: ["English"],
    ageGroups: ["2–4", "5–10"],
    drives: true,
    firstAid: true,
    visaType: "Residence visa",
    reviews: [
      { id: "1", author: "Sam W.", rating: 5, comment: "Brilliant. Will book again.", date: "1 week ago" },
    ],
  },
];

export const getSitter = (id: string) => sitters.find(s => s.id === id);
