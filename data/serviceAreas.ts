export interface ServiceAreaFAQ {
  question: string;
  answer: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  popularCategories: {
    title: string;
    description: string;
    iconName: string;
    link: string;
  }[];
  faqs: ServiceAreaFAQ[];
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: "kent",
    name: "Kent",
    slug: "kent-wa",
    state: "WA",
    metaTitle: "Pet Shop & Fish Aquarium Supplies Near Kent, WA | Sierra Fish & Pets",
    metaDescription: "Looking for a pet shop near Kent, WA? Sierra Fish & Pets provides premium dog supplies, puppy essentials, freshwater & saltwater fish, aquarium accessories, and pet food.",
    keywords: [
      "pet shop Kent WA",
      "pet supplies Kent WA",
      "pet supplies near Kent WA",
      "fish aquarium Kent WA",
      "puppy supplies Kent WA",
      "aquarium accessories Kent WA",
      "dog supplies Kent WA",
      "pet food supplies Kent WA",
      "pet food store Kent WA"
    ],
    popularCategories: [
      {
        title: "Fish Aquarium & Live Fish",
        description: "Freshwater tropicals, cichlids, marine fish, live plants, and coral systems.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog & Puppy Supplies",
        description: "Nutritious puppy food, training treats, durable toys, leashes, and supplements.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Canister filters, LED lighting, heaters, pumps, substrate, and water conditioners.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Store",
        description: "Grain-free, raw, freeze-dried, and holistic foods for dogs, cats, birds, and reptiles.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where is Sierra Fish & Pets located?",
        answer: "We are located at 601 S Grady Way Suite M, Renton, WA 98057, serving pet parents throughout Kent and South King County."
      },
      {
        question: "Do you offer live fish and aquarium accessories for Kent hobbyists?",
        answer: "Yes, we specialize in both freshwater and saltwater fish, live plants, corals, complete aquarium kits, filtration, heaters, and accessories."
      },
      {
        question: "What puppy and dog supplies do you carry?",
        answer: "We carry high-quality dog food, puppy developmental formulas, treats, chew toys, crates, grooming supplies, and offer in-store nail trims."
      },
      {
        question: "Can I order online for in-store pickup?",
        answer: "Yes, you can place orders through our website and pick them up directly at our store."
      }
    ]
  },
  {
    id: "tukwila",
    name: "Tukwila",
    slug: "tukwila-wa",
    state: "WA",
    metaTitle: "Pet Supplies & Fish Aquariums near Tukwila, WA | Sierra Fish & Pets",
    metaDescription: "Pet shop serving Tukwila & Southcenter. Shop fresh/saltwater fish, dog food, puppy supplies, aquarium accessories, and pet food supplies.",
    keywords: [
      "pet shop Tulwila WA",
      "pet supplies Tulwila WA",
      "pet supplies near Tulwila WA",
      "fish aquarium Tulwila WA",
      "puppy supplies Tulwila WA",
      "aquarium accessories Tulwila WA",
      "dog supplies Tulwila WA",
      "pet food supplies Tulwila WA",
      "pet food store Tulwila WA",
      "pet shop Tukwila WA",
      "pet supplies Tukwila WA",
      "fish aquarium Tukwila WA",
      "puppy supplies Tukwila WA",
      "dog supplies Tukwila WA"
    ],
    popularCategories: [
      {
        title: "Fish Aquarium & Live Fish",
        description: "Freshwater tropicals, cichlids, marine fish, invertebrates, and planted aquarium gear.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog & Puppy Supplies",
        description: "Premium dog dry kibble, raw foods, puppy teething toys, harnesses, and crates.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Filters, lighting, test kits, heaters, water conditioners, and accessories.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Store",
        description: "Top brands of holistic pet food, allergy-sensitive diets, and natural treats.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where can I find a pet food store and fish aquarium near Tukwila?",
        answer: "Sierra Fish & Pets is located at 601 S Grady Way Suite M in Renton, offering complete aquatic and pet supplies for Tukwila and Southcenter residents."
      },
      {
        question: "Do you offer puppy supplies and healthy dog food?",
        answer: "Yes, we carry a full selection of premium dog foods, puppy training aids, bowls, beds, and health supplements."
      },
      {
        question: "Do you test aquarium water for Tukwila fish keepers?",
        answer: "Yes! Bring a cup of your aquarium water to our store for free comprehensive water quality testing."
      }
    ]
  },
  {
    id: "seatac",
    name: "SeaTac",
    slug: "seatac-wa",
    state: "WA",
    metaTitle: "Pet Shop & Dog Supplies Near SeaTac, WA | Sierra Fish & Pets",
    metaDescription: "Looking for pet supplies or a fish aquarium store near SeaTac, WA? Sierra Fish & Pets offers quality dog food, puppy gear, live fish, and aquarium accessories.",
    keywords: [
      "pet shop SeaTac WA",
      "pet supplies SeaTac WA",
      "pet supplies near SeaTac WA",
      "fish aquarium SeaTac WA",
      "puppy supplies SeaTac WA",
      "aquarium accessories SeaTac WA",
      "dog supplies SeaTac WA",
      "pet food supplies SeaTac WA",
      "pet food store SeaTac WA"
    ],
    popularCategories: [
      {
        title: "Fish Aquarium & Tank Care",
        description: "Freshwater & reef aquariums, custom builds, lighting, and water conditioning.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Puppy & Dog Essentials",
        description: "Puppy starter supplies, crate training essentials, premium foods, and gentle harnesses.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Water test kits, replacement filter media, wavemakers, and driftwood.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Holistic Pet Food",
        description: "Nutritious natural food brands for dogs, cats, small animals, and reptiles.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Is there a pet shop near SeaTac WA with aquarium supplies?",
        answer: "Yes, Sierra Fish & Pets in Renton offers a comprehensive showroom of freshwater/saltwater fish, aquarium accessories, and full pet supplies."
      },
      {
        question: "What types of dog food supplies do you stock?",
        answer: "We stock grain-inclusive, grain-free, raw frozen, freeze-dried, and specialized formulas."
      }
    ]
  },
  {
    id: "covington",
    name: "Covington",
    slug: "covington-wa",
    state: "WA",
    metaTitle: "Pet Supplies & Fish Aquariums near Covington, WA | Sierra Fish & Pets",
    metaDescription: "Serving Covington, WA pet owners with top dog supplies, puppy nutrition, live freshwater/saltwater fish, and complete aquarium accessories at Sierra Fish & Pets.",
    keywords: [
      "pet shop Covington WA",
      "pet supplies Covington WA",
      "pet supplies near Covington WA",
      "fish aquarium Covington WA",
      "puppy supplies Covington WA",
      "aquarium accessories Covington WA",
      "dog supplies Covington WA",
      "pet food supplies Covington WA",
      "pet food store Covington WA"
    ],
    popularCategories: [
      {
        title: "Aquarium Accessories & Live Fish",
        description: "Pumps, chillers, heaters, CO2 systems, aquascaping stones, and rare livestock.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog & Puppy Supplies",
        description: "High-protein puppy kibble, teething toys, training pads, and wellness items.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Pet Food Supplies",
        description: "Premium dog, cat, bird, reptile, and small animal diets from trusted brands.",
        iconName: "ShoppingBag",
        link: "/shop"
      },
      {
        title: "Aquarium Services",
        description: "Aquarium setup consulting, water testing, and maintenance advice.",
        iconName: "ShieldCheck",
        link: "/services"
      }
    ],
    faqs: [
      {
        question: "Why do Covington pet owners choose Sierra Fish & Pets?",
        answer: "We provide family-owned service, healthy aquatic livestock, custom setups, and quality pet food brands."
      },
      {
        question: "Do you have puppy supplies and training products?",
        answer: "Yes, we carry training treats, crates, pads, leashes, puppy foods, and gentle grooming supplies."
      }
    ]
  },
  {
    id: "newcastle",
    name: "Newcastle",
    slug: "newcastle-wa",
    state: "WA",
    metaTitle: "Pet Shop & Aquarium Supplies Near Newcastle, WA | Sierra Fish & Pets",
    metaDescription: "Pet shop serving Newcastle with high-grade dog food, puppy supplies, vibrant aquarium fish, reef supplies, and aquarium accessories.",
    keywords: [
      "pet shop Newcastle WA",
      "pet supplies Newcastle WA",
      "pet supplies near Newcastle WA",
      "fish aquarium Newcastle WA",
      "puppy supplies Newcastle WA",
      "aquarium accessories Newcastle WA",
      "dog supplies Newcastle WA",
      "pet food supplies Newcastle WA",
      "pet food store Newcastle WA"
    ],
    popularCategories: [
      {
        title: "Fish Aquarium & Marine Life",
        description: "Freshwater fish, saltwater corals, nano tanks, and filtration equipment.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog Supplies & Puppy Nutrition",
        description: "Puppy foods, durable chews, joint health supplements, and beds.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "LED lighting, specialized substrates, testing kits, and reef care.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Natural Pet Food Store",
        description: "Nutritious pet food supplies for dogs, cats, small animals, and reptiles.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where is Sierra Fish & Pets located for Newcastle residents?",
        answer: "We are located at 601 S Grady Way Suite M in Renton, easily accessible from Newcastle."
      },
      {
        question: "Do you offer aquarium setup and consultation?",
        answer: "Yes, our team provides consultation, equipment sourcing, aquascaping design, and installation support."
      }
    ]
  },
  {
    id: "bellevue",
    name: "Bellevue",
    slug: "bellevue-wa",
    state: "WA",
    metaTitle: "Pet Shop & Fish Aquarium Supplies Near Bellevue, WA | Sierra Fish & Pets",
    metaDescription: "Serving Bellevue pet parents with exotic fish, custom aquariums, puppy supplies, dog food, and aquarium accessories at Sierra Fish & Pets.",
    keywords: [
      "pet shop Bellevue WA",
      "pet supplies Bellevue WA",
      "pet supplies near Bellevue WA",
      "fish aquarium Bellevue WA",
      "puppy supplies Bellevue WA",
      "aquarium accessories Bellevue WA",
      "dog supplies Bellevue WA",
      "pet food supplies Bellevue WA",
      "pet food store Bellevue WA"
    ],
    popularCategories: [
      {
        title: "Exotic Fish & Custom Aquariums",
        description: "Planted tanks, reef systems, marine fish, and aquarium installations.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Puppy & Dog Supplies",
        description: "Puppy nutrition, training gear, organic treats, and collars.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Dosing pumps, RO/DI systems, lighting, and filtration.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Store Supplies",
        description: "Wholesome food for dogs, cats, birds, and reptiles.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "What makes Sierra Fish & Pets popular with Bellevue aquarium hobbyists?",
        answer: "We maintain a large selection of quarantined healthy livestock, rare corals, planted aquarium supplies, and expert staff guidance."
      },
      {
        question: "Do you supply aquarium accessories and maintenance products?",
        answer: "Yes, we carry filtration, lighting, plumbing, test kits, and water treatments."
      }
    ]
  },
  {
    id: "seattle",
    name: "Seattle",
    slug: "seattle-wa",
    state: "WA",
    metaTitle: "Pet Shop & Fish Aquarium Store Near Seattle, WA | Sierra Fish & Pets",
    metaDescription: "Serving Seattle, WA pet owners with an unmatched selection of live fish, custom aquariums, puppy supplies, dog food, and aquarium accessories.",
    keywords: [
      "pet shop Seattle WA",
      "pet supplies Seattle WA",
      "pet supplies near Seattle WA",
      "fish aquarium Seattle WA",
      "puppy supplies Seattle WA",
      "aquarium accessories Seattle WA",
      "dog supplies Seattle WA",
      "pet food supplies Seattle WA",
      "pet food store Seattle WA"
    ],
    popularCategories: [
      {
        title: "Aquarium & Aquatic Experts",
        description: "Freshwater tropicals, cichlids, saltwater coral, live plants, and custom tanks.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog & Puppy Supplies",
        description: "Puppy training gear, premium kibble, dental chews, beds, and crates.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories Store",
        description: "CO2 equipment, lighting, chillers, heaters, internal filters, and hardscaping.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Supplies",
        description: "Nutritious foods and treats for companion dogs, cats, reptiles, and birds.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where is Sierra Fish & Pets located?",
        answer: "Our store is located at 601 S Grady Way Suite M, Renton, WA 98057, serving Seattle and King County pet owners since 1970."
      },
      {
        question: "What dog and puppy supplies are available?",
        answer: "We carry top nutritional dog food brands, puppy training supplies, crates, harnesses, healthy chews, and in-store nail trims."
      }
    ]
  },
  {
    id: "des-moines",
    name: "Des Moines",
    slug: "des-moines-wa",
    state: "WA",
    metaTitle: "Pet Supplies & Fish Aquarium Near Des Moines, WA | Sierra Fish & Pets",
    metaDescription: "Looking for a pet shop near Des Moines, WA? Sierra Fish & Pets features live fish, custom aquariums, puppy supplies, dog food, and aquarium accessories.",
    keywords: [
      "pet shop Des Moines WA",
      "pet supplies Des Moines WA",
      "pet supplies near Des Moines WA",
      "fish aquarium Des Moines WA",
      "puppy supplies Des Moines WA",
      "puppy suppliesDes Moines WA",
      "aquarium accessories Des Moines WA",
      "dog supplies Des Moines WA",
      "pet food supplies Des Moines WA",
      "pet food store Des Moines WA"
    ],
    popularCategories: [
      {
        title: "Fish Aquarium & Coral Supplies",
        description: "Saltwater & freshwater fish, live corals, tank filtration, and water test kits.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Puppy & Dog Supplies",
        description: "Puppy formulas, teething toys, training pads, natural treats, and leashes.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Submersible heaters, aerators, filter sponges, LED hoods, and driftwood.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Store Supplies",
        description: "Holistic pet foods, freeze-dried raw, canned formulas, and supplements.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where can I buy puppy supplies and fish aquarium gear near Des Moines, WA?",
        answer: "Sierra Fish & Pets in Renton is located at 601 S Grady Way Suite M, offering a complete showroom of pets, fish, foods, and accessories."
      },
      {
        question: "Do you offer free water testing for aquarium owners?",
        answer: "Yes! Bring a water sample to our store and our team will test key water parameters for free."
      }
    ]
  },
  {
    id: "maple-valley",
    name: "Maple Valley",
    slug: "maple-valley-wa",
    state: "WA",
    metaTitle: "Pet Shop & Fish Aquarium Near Maple Valley, WA | Sierra Fish & Pets",
    metaDescription: "Serving Maple Valley, WA with trusted puppy supplies, premium dog food, live freshwater & saltwater fish, and aquarium accessories at Sierra Fish & Pets.",
    keywords: [
      "pet shop Maple valley WA",
      "pet supplies Maple valley WA",
      "pet supplies near Maple valley WA",
      "fish aquarium Maple valley WA",
      "puppy supplies Maple valley WA",
      "aquarium accessories Maple valley WA",
      "dog supplies Maple valley WA",
      "pet food supplies Maple valley WA",
      "pet food store Maple valley WA"
    ],
    popularCategories: [
      {
        title: "Live Fish & Aquarium Sets",
        description: "Freshwater aquascaping, marine setups, live fish, plants, and aquariums.",
        iconName: "Fish",
        link: "/services"
      },
      {
        title: "Dog & Puppy Care",
        description: "Puppy essentials, nutrition, training accessories, and chews.",
        iconName: "Dog",
        link: "/shop/dog"
      },
      {
        title: "Aquarium Accessories",
        description: "Canister filters, powerheads, heaters, gravel, decor, and cleaning supplies.",
        iconName: "Sliders",
        link: "/shop/aquatic"
      },
      {
        title: "Pet Food Supplies Store",
        description: "Natural pet foods, freeze-dried treats, bird seed, and small animal diets.",
        iconName: "ShoppingBag",
        link: "/shop"
      }
    ],
    faqs: [
      {
        question: "Where is Sierra Fish & Pets located?",
        answer: "We are located at 601 S Grady Way Suite M in Renton, serving pet owners throughout South King County and Maple Valley."
      },
      {
        question: "What pet and aquarium supplies do you carry?",
        answer: "We carry healthy live fish, custom aquarium systems, aquarium accessories, puppy gear, dog supplies, and premium pet foods."
      }
    ]
  }
];

export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  const normalizedSlug = slug.toLowerCase().trim();
  if (normalizedSlug === "tulwila-wa" || normalizedSlug === "tulwila") {
    return SERVICE_AREAS.find((s) => s.slug === "tukwila-wa");
  }
  return SERVICE_AREAS.find(
    (area) => area.slug === normalizedSlug || area.id === normalizedSlug
  );
}
