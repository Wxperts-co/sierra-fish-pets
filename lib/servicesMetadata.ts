export interface ServiceMetadata {
  title: string;
  description: string;
  keywords: string | string[];
}

export const SERVICES_METADATA: Record<string, ServiceMetadata> = {
  "aquarium-consulting-design": {
    title: "Aquarium Consulting & Design Renton | Sierra Fish & Pets",
    description:
      "Expert custom aquarium design and consultations in Renton, WA for home and business aquascapes, equipment planning, and livestock at Sierra Fish & Pets.",
    keywords: [
      "Aquarium Consulting & Design Renton WA",
      "custom aquascape design",
      "commercial aquarium consulting",
      "home aquarium planning renton",
    ],
  },
  "aquarium-installation": {
    title: "Aquarium Installation Services Renton | Sierra Fish & Pets",
    description:
      "Full-service aquarium delivery, professional setup, aquascaping, cycling, and livestock introduction in Renton, WA from Sierra Fish & Pets.",
    keywords: [
      "Aquarium Installation Renton WA",
      "fish tank setup renton",
      "professional aquarium delivery",
      "tank cycling services",
    ],
  },
  "custom-aquariums": {
    title: "Custom Aquarium Builds Renton WA | Sierra Fish & Pets",
    description:
      "Bespoke glass & acrylic custom aquariums built to any size and specification with custom cabinetry and plumbing in Renton, WA by Sierra Fish & Pets.",
    keywords: [
      "custom aquarium build renton wa",
      "custom glass fish tank",
      "custom acrylic aquariums",
      "bespoke aquarium cabinetry",
    ],
  },
  "about-aqua-jet-water-cleaning-system": {
    title: "Aqua Jet Water Cleaning System | Sierra Fish & Pets",
    description:
      "The Sierra Aqua Jet faucet-connected water changer and gravel cleaner eliminates heavy bucket lifting for effortless aquarium maintenance in Renton, WA.",
    keywords: [
      "aqua jet water cleaning system",
      "aquarium water changer",
      "faucet gravel vacuum",
      "effortless fish tank water changes",
    ],
  },
  "aquarium-water-testing": {
    title: "Aquarium Water Testing Renton WA | Sierra Fish & Pets",
    description:
      "Free professional liquid aquarium water testing for pH, ammonia, nitrite, nitrate, and hardness with expert guidance in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "Aquarium Water Testing Renton WA",
      "free fish tank water test",
      "liquid water analysis renton",
      "saltwater salinity test",
    ],
  },
  "fish-of-month-club": {
    title: "Fish of the Month Club for Kids | Sierra Fish & Pets",
    description:
      "Free Fish of the Month Club for young hobbyists aged 10 & under. Pick up your monthly punchcard and build your home aquarium at Sierra Fish & Pets Renton.",
    keywords: [
      "Fish of the Month Club",
      "free fish kids renton",
      "youth aquarium hobbyist",
      "renton pet store kids club",
    ],
  },
  "pet-nail-wing-trims": {
    title: "Pet Nail & Wing Trimming Renton | Sierra Fish & Pets",
    description:
      "Gentle, walk-in pet nail and bird wing trimming services in Renton, WA for dogs, cats, reptiles, and birds at Sierra Fish & Pets.",
    keywords: [
      "Pet Nail Trimming Renton WA",
      "bird wing trimming renton",
      "cat nail clipping",
      "reptile nail care renton",
    ],
  },
  "store-tours": {
    title: "Educational Store Tours Renton | Sierra Fish & Pets",
    description:
      "Fun, educational pet and aquatic store tours for schools, scouts, and families in Renton, WA. Learn pet care and meet animals at Sierra Fish & Pets.",
    keywords: [
      "Store Tours Renton WA",
      "educational pet store tour",
      "school field trip pet store",
      "kids aquarium tour",
    ],
  },
  "dog-adoption": {
    title: "Dog Adoption Events Renton WA | Sierra Fish & Pets",
    description:
      "Meet adoptable rescue dogs and puppies from local partner shelters at Sierra Fish & Pets adoption events in Renton, WA. Find your new family member!",
    keywords: [
      "Dog Adoption Events Renton WA",
      "rescue dog adoption",
      "puppy adoption pet store renton",
      "pet adoption day",
    ],
  },
  "dog-adoption-events": {
    title: "Dog Adoption Events Renton WA | Sierra Fish & Pets",
    description:
      "Meet adoptable rescue dogs and puppies from local partner shelters at Sierra Fish & Pets adoption events in Renton, WA. Find your new family member!",
    keywords: [
      "Dog Adoption Events Renton WA",
      "rescue dog adoption",
      "puppy adoption pet store renton",
      "pet adoption day",
    ],
  },
  "aquarium-philosophy": {
    title: "Our Aquarium Philosophy | Sierra Fish & Pets Renton",
    description:
      "Discover Sierra Fish & Pets' natural ecological philosophy for healthy, thriving freshwater and saltwater aquariums in Renton, WA since 1972.",
    keywords: [
      "Aquarium Philosophy Renton",
      "natural aquatic balance",
      "ecological fish keeping",
      "sustainable aquarium renton",
    ],
  },
};

export const DEFAULT_SERVICES_METADATA: ServiceMetadata = {
  title: "Professional Pet & Aquarium Services | Sierra Fish & Pets",
  description:
    "Expert pet & aquarium services in Renton, WA: custom aquarium design, setup, water testing, pet nail trims & adoption events at Sierra Fish & Pets.",
  keywords: [
    "aquarium services renton wa",
    "custom aquarium design and installation renton",
    "aquarium water testing renton",
    "pet nail trim renton wa",
  ],
};

export function getServiceMetadata(slug?: string | null): ServiceMetadata {
  if (!slug) return DEFAULT_SERVICES_METADATA;
  const slugLower = slug.toLowerCase().trim();
  return SERVICES_METADATA[slugLower] || DEFAULT_SERVICES_METADATA;
}
