export interface ServiceMetadata {
  title: string;
  description: string;
  keywords: string | string[];
}

export const SERVICES_METADATA: Record<string, ServiceMetadata> = {
  "aquarium-consulting-design": {
    title: "Sierra Fish and Pets | Aquarium Consulting & Design Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton, WA provides custom aquarium design, expert installation, water testing, cleaning, and professional pet trimming services.",
    keywords:
      "Aquarium Consulting & Design Renton, WA, Aquarium Philosophy, Aquarium Installation, Aqua Jet Water, Cleaning System, Aquarium Water Testing & Analysis, Fish of the Month Club, Pet Nail & Wing Trims",
  },
  "aquarium-water-testing": {
    title: "Aquarium Water Testing Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA provides expert aquarium water testing and analysis services to keep your fish healthy.",
    keywords:
      "Aquarium Water Testing & Analysis Services Renton, WA",
  },
  "pet-nail-wing-trims": {
    title: "Pet Nail & Wing Trimming Services Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA provides professional aquarium water testing and analysis services to ensure your aquatic habitat stays healthy",
    keywords:
      "Pet Nail & Wing Trimming Services",
  },
  "store-tours": {
    title: "Store Tours & Animal Care Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA offers engaging store tours and expert animal care services to support all your pets.",
    keywords:
      "Store Tours & Animal Care Renton, WA ,Best Animal Care Renton, WA",
  },
};

export const DEFAULT_SERVICES_METADATA: ServiceMetadata = {
  title: "Professional Aquarium & Pet Services | Sierra Fish & Pets",
  description:
    "Sierra Fish & Pets in Renton, WA offers expert aquarium consulting, installation, water testing, maintenance, and pet grooming services.",
  keywords:
    "Aquarium Services Renton WA, Custom Aquarium Design, Pet Services, Fish Tank Maintenance",
};

export function getServiceMetadata(slug?: string | null): ServiceMetadata {
  if (!slug) return DEFAULT_SERVICES_METADATA;
  const slugLower = slug.toLowerCase().trim();
  return SERVICES_METADATA[slugLower] || DEFAULT_SERVICES_METADATA;
}
