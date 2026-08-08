export type TravelRecommendation = {
  title: string;
  description: string;
  category: "Place" | "Food" | "Stay" | "Walk";
};

export type TravelExpense = {
  label: string;
  amount: number;
  currency: string;
};

export type TripPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type Trip = {
  slug: string;
  title: string;
  location: string;
  country: string;
  year: number;
  dateRange: string;
  description: string;
  highlights: string[];
  tags: string[];
  coverImage: string;
  photos: TripPhoto[];
  mapPosition: {
    left: number;
    top: number;
  };
  recommendations?: TravelRecommendation[];
  expenses?: TravelExpense[];
};

export const trips: Trip[] = [
  {
    slug: "jaipur-monsoon-days",
    title: "Jaipur monsoon days",
    location: "Jaipur",
    country: "India",
    year: 2026,
    dateRange: "August 2026",
    description:
      "A slow monsoon visit with warm evenings, old streets, and long pauses for tea.",
    highlights: [
      "Amber light after rain",
      "Quiet walks in the old city",
      "Long conversations and slower meals",
    ],
    tags: ["rain", "city", "tea"],
    coverImage: "/images/travel/jaipur-monsoon.jpg",
    mapPosition: {
      left: 67,
      top: 53,
    },
    photos: [
      {
        src: "/images/travel/jaipur-monsoon.jpg",
        alt: "A quiet street in Jaipur after rain",
        caption: "The old city after the first rain",
      },
      {
        src: "/images/travel/jaipur-street.jpg",
        alt: "A warm evening street in Jaipur",
        caption: "Warm light along a familiar street",
      },
      {
        src: "/images/travel/jaipur-tea.jpg",
        alt: "Tea served during a slow afternoon",
        caption: "A pause for tea",
      },
    ],
    recommendations: [
  {
    title: "Amber Fort in the early morning",
    description:
      "Go early, before the heat arrives and the courtyards become crowded.",
    category: "Place",
  },
  {
    title: "Tea after the rain",
    description:
      "Find a quiet place to sit, order tea, and let the city slow down around you.",
    category: "Food",
  },
  {
    title: "Walking through the old city",
    description:
      "The smaller streets are often more memorable than the famous landmarks.",
    category: "Walk",
  },
],

expenses: [
  {
    label: "Transport",
    amount: 0,
    currency: "INR",
  },
  {
    label: "Stay",
    amount: 0,
    currency: "INR",
  },
  {
    label: "Food",
    amount: 0,
    currency: "INR",
  },
],
  },

  {
    slug: "goa-offseason",
    title: "Goa in the off-season",
    location: "Goa",
    country: "India",
    year: 2025,
    dateRange: "October 2025",
    description:
      "A quieter version of a familiar place, with empty beaches and time to think.",
    highlights: [
      "Empty beaches",
      "Slow afternoons",
      "A different sense of the coast",
    ],
    tags: ["beach", "off-season", "coast"],
    coverImage: "/images/travel/goa-offseason.jpg",
    mapPosition: {
      left: 64,
      top: 59,
    },
    photos: [
      {
        src: "/images/travel/goa-offseason.jpg",
        alt: "An empty beach in Goa",
        caption: "The coast without the usual noise",
      },
      {
        src: "/images/travel/goa-coast.jpg",
        alt: "Waves along the Goan coast",
        caption: "A long afternoon by the sea",
      },
    ],
  },

  {
    slug: "kathmandu-city-walks",
    title: "Kathmandu city walks",
    location: "Kathmandu",
    country: "Nepal",
    year: 2024,
    dateRange: "December 2024",
    description:
      "Morning walks, old lanes, and the feeling that the city rewards attention.",
    highlights: [
      "Markets and temples",
      "Early morning light",
      "Small notes from walking",
    ],
    tags: ["city", "walking", "culture"],
    coverImage: "/images/travel/kathmandu-walks.jpg",
    mapPosition: {
      left: 70,
      top: 47,
    },
    photos: [
      {
        src: "/images/travel/kathmandu-walks.jpg",
        alt: "An old lane in Kathmandu",
        caption: "The city before it became busy",
      },
      {
        src: "/images/travel/kathmandu-market.jpg",
        alt: "A market street in Kathmandu",
        caption: "Colour and movement in the old lanes",
      },
    ],
  },
];

export function getTripBySlug(slug: string) {
  return trips.find((trip) => trip.slug === slug);
}