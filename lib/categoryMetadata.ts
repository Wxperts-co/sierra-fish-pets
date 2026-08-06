export interface CategoryMetadata {
  title: string;
  description: string;
  keywords: string | string[];
}

export const CATEGORY_METADATA: Record<string, CategoryMetadata> = {
  bird: {
    title: "Sierra Fish and Pets | Bird Food |Bird Toys & Supplies Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton, WA provides bird food, vitamins, toys, perches, cages, stands, live birds, and wild supplies.",
    keywords:
      "Bird Food Services Renton, WA, Bird Health/Vitamins, Bird Toys & Perches, Bird Cages & Stands, bird cages & stands, bird med & vitamins, bird toys & supplies, birds-live, wild bird supplies",
  },
  cat: {
    title: "Sierra Fish and Pets | Cat Beds & Furniture Renton, WA ",
    description:
      "Sierra Fish and Pets Renton offers cat beds, furniture, litter boxes, waste disposal, toys, treats, catnip, Weruva, Petite Cuisine, Fussie.",
    keywords:
      "Cat Beds & Furniture Renton, WA, Cat Litter Boxes, Cat Toys, Cat Treats, Cat Waste Disposal, Cat Nip & Grass, cat furniture, fussier cat pet food, petite cuisine, weruva",
  },
  dog: {
    title: "Sierra Fish and Pets | Dog Bowls & Feeders Renton, WA ",
    description:
      "Sierra Fish and Pets Renton offers dog food, veterinary diets, toys, training treats, bowls, apparel, grooming, and premium pet supplies.",
    keywords:
      "Dog Bowls & Feeders Renton, WA , Dog Jerky, Dog Milk Replacers, Dog Toys, Dog Training, Dog Training Treats, Dog Waste Mgmt., Dog Food Dry, Dog Food Freeze Dried , Dog Food Canned, Dog Vet Auth. Diets, dog/cat supplies, canine cavier, dogs well foods, pet's grooming, pet collars &apparel, pet groom & health, pet toys & treats",
  },
  aquatic: {
    title: "Sierra Fish and Pets | Fish Water Care & Fish Saltwater Aquarium Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton offers fish feeders, food, starter kits, saltwater aquariums, Aqua Jet filters, pond care, water testing.",
    keywords:
      "Fish Feeders, Fish Food, Fish Maintenance, Fish Starter Kits, Fish Saltwater Aquarium, Fish Treatment, Fish Pond Care, Fish Water Care, Fish Water Tests, Fish tank systems AquaJet Filters",
  },
  reptile: {
    title: "Sierra Fish and Pets | Terrarium & Reptile Cage Supplies Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton, WA offers top terrariums, cages, food, lighting, substrates, and care supplies for healthy reptiles.",
    keywords:
      "Terrarium Decor Supplies, Cleaning And Waste Disposal Supplies, Feeding And Watering Supplies, Substrates And Bedding, Heaters And Lighting, Amphibian And Reptile Food , Supplements And Internal Health Supplies, Terrariums And Reptile Cages, Terrarium and Reptile Cage Supplies, Care And Maintenance, Amphibian And Reptile Food Supplements And Internal Health Supplies",
  },
  "small-pet": {
    title: "Sierra Fish and Pets | Cages And Habitat Supplies Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton, WA provides premium cages, habitats, healthy food, grooming tools, beds, and essential pet supplies.",
    keywords:
      "Cages and Habitat Supplies Renton, WA, Health And Wellness, Feeding And Watering Supplies, Beds And Furniture, Food Health And Wellness, Cages And Habitat Supplies, Litter Cleaning And Bedding, Bathing And Grooming Supplies, Cages And Habitat Supplies Toys, Pet Transport And Containment Systems, Collars And Harnesses",
  },
  "small-animal": {
    title: "Sierra Fish and Pets | Cages And Habitat Supplies Renton, WA ",
    description:
      "Sierra Fish and Pets in Renton, WA provides premium cages, habitats, healthy food, grooming tools, beds, and essential pet supplies.",
    keywords:
      "Cages and Habitat Supplies Renton, WA, Health And Wellness, Feeding And Watering Supplies, Beds And Furniture, Food Health And Wellness, Cages And Habitat Supplies, Litter Cleaning And Bedding, Bathing And Grooming Supplies, Cages And Habitat Supplies Toys, Pet Transport And Containment Systems, Collars And Harnesses",
  },
};

export const DEFAULT_SHOP_METADATA: CategoryMetadata = {
  title: "Shop Pet Supplies | Sierra Fish & Pets",
  description:
    "Explore high-quality pet food, supplies, toys, and accessories for dogs, cats, birds, fish, reptiles, and small animals at Sierra Fish & Pets in Renton, WA.",
  keywords:
    "Pet Supplies Renton WA, Pet Store Renton, Dog Supplies, Cat Supplies, Bird Supplies, Fish & Aquarium Supplies",
};

export function getCategoryMetadata(categorySlug?: string | null): CategoryMetadata {
  if (!categorySlug) return DEFAULT_SHOP_METADATA;
  const slugLower = categorySlug.toLowerCase().trim();
  return CATEGORY_METADATA[slugLower] || DEFAULT_SHOP_METADATA;
}
