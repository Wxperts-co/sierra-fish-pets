import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const envContent = fs.readFileSync(path.resolve(".env.local"), "utf-8");
const uriMatch = envContent.match(/MONGODB_URI=["']?([^"'\s]+)["']?/);
const MONGODB_URI = uriMatch ? uriMatch[1] : "";

const allBrandsData = [
  // Existing Dog & Cat Brands
  { id: "brand-001", name: "Blue Buffalo", slug: "blue-buffalo", logo: "/images/brands/BlueBuffalo.webp", description: "Premium natural pet food brand focused on the health and well-being of dogs and cats.", categories: ["dog", "cat"], featured: true, website: "https://www.bluebuffalo.com" },
  { id: "brand-002", name: "Nulo", slug: "nulo", logo: "/images/brands/nulo.webp", description: "Science-based nutritional formulas tailored to the specific needs of dogs and cats.", categories: ["dog", "cat"], featured: true, website: "https://nulo.com" },
  { id: "brand-003", name: "Natural Balance", slug: "natural-balance", logo: "/images/brands/naturalbalance.webp", description: "Grain-free formulas inspired by balanced diets.", categories: ["dog", "cat"], featured: true, website: "https://www.naturalbalanceinc.com" },
  { id: "brand-004", name: "Orijen", slug: "orijen", logo: "/images/brands/orijen.webp", description: "Biologically appropriate pet food designed to meet the nutritional needs of dogs and cats.", categories: ["dog", "cat"], featured: true, website: "https://orijenpetfoods.com" },
  { id: "brand-005", name: "Earthborn", slug: "earthborn", logo: "/images/brands/earthborn.webp", description: "Natural and holistic pet food made with real meat and vegetables.", categories: ["dog", "cat"], featured: true, website: "https://earthbornholisticpetfood.com" },
  { id: "brand-006", name: "Taste of the Wild", slug: "taste-of-the-wild", logo: "/images/brands/tasteofwild.webp", description: "Protein-rich recipes inspired by the ancestral diet of dogs and cats.", categories: ["dog", "cat"], featured: true, website: "https://www.tasteofthewildpetfood.com" },
  { id: "brand-007", name: "Taste of the Wild PREY", slug: "taste-of-the-wild-prey", logo: "/images/brands/tasteofwildprey.webp", description: "Limited ingredient diets for dogs and cats with simplified nutrition.", categories: ["dog", "cat"], featured: false, website: "https://www.tasteofthewildpetfood.com" },
  { id: "brand-008", name: "Acana", slug: "acana", logo: "/images/brands/acana.webp", description: "Premium pet food crafted with quality animal ingredients and balanced nutrition.", categories: ["dog", "cat"], featured: true, website: "https://acana.com" },
  { id: "brand-009", name: "AvoDerm", slug: "avoderm", logo: "/images/brands/avoderm.webp", description: "Pet nutrition enriched with avocados to support healthy skin and coat.", categories: ["dog", "cat"], featured: true, website: "https://avodermnatural.com" },
  { id: "brand-010", name: "Evanger's", slug: "evangers", logo: "/images/brands/evangers.webp", description: "Family-owned pet food company offering high-quality canned and dry food recipes.", categories: ["dog", "cat"], featured: true, website: "https://evangersdogfood.com" },
  { id: "brand-011", name: "Canine Caviar", slug: "canine-caviar", logo: "/images/brands/canine-cavier.webp", description: "Holistic pet food focused on alkaline-based nutrition for dogs.", categories: ["dog"], featured: true, website: "https://caninecaviar.com" },
  { id: "brand-012", name: "Northwest Naturals", slug: "northwest-naturals", logo: "/images/brands/nwn.webp", description: "Raw frozen and freeze-dried pet foods made from premium natural ingredients.", categories: ["dog", "cat"], featured: true, website: "https://nw-naturals.net" },
  { id: "brand-013", name: "Primal", slug: "primal", logo: "/images/brands/primal.webp", description: "Raw and fresh pet nutrition crafted with responsibly sourced ingredients.", categories: ["dog", "cat"], featured: true, website: "https://primalpetfoods.com" },
  { id: "brand-014", name: "Redbarn", slug: "redbarn", logo: "/images/brands/redbarn.webp", description: "Premium pet food, treats, and chews made with high-quality ingredients.", categories: ["dog", "cat"], featured: true, website: "https://redbarn.com" },
  { id: "brand-015", name: "KOHA", slug: "koha", logo: "/images/brands/koha.webp", description: "Minimal ingredient recipes designed for pets with food sensitivities.", categories: ["dog", "cat"], featured: false, website: "https://kohapet.com" },

  // Reptile Brands
  { id: "brand-rep-001", name: "Zoo Med", slug: "zoo-med", logo: "/images/brands/zodmed.webp", description: "World leader in reptile lighting, heating, terrariums, and aquatic supplies.", categories: ["reptile", "aquatic"], featured: true, website: "https://zoomed.com" },
  { id: "brand-rep-002", name: "Zilla", slug: "zilla", logo: "/images/brands/zilla.webp", description: "Innovative habitats, lighting, and nutrition for reptiles and amphibians.", categories: ["reptile"], featured: true, website: "https://www.zillarules.com" },
  { id: "brand-rep-003", name: "Galapagos", slug: "galapagos", logo: "/images/brands/galapagos.webp", description: "Natural moss, wood, substrates, and terrarium decor for reptiles.", categories: ["reptile"], featured: true, website: "https://galapagospet.com" },
  { id: "brand-rep-004", name: "ExoTerra", slug: "exoterra", logo: "/images/brands/exoterra.webp", description: "Market leader for natural terrariums and reptile care supplies.", categories: ["reptile"], featured: true, website: "https://exo-terra.com" },
  { id: "brand-rep-005", name: "Repashy Super Foods", slug: "repashy-super-foods", logo: "/images/brands/repashy.webp", description: "Specialized gel diets and meal replacement powder formulas for reptiles and amphibians.", categories: ["reptile"], featured: true, website: "https://www.store.repashy.com" },
  { id: "brand-custom-1785541125558", name: "Komodo Reptile", slug: "komodo-reptile-", logo: "/images/brands/komodo.webp", description: "Habitat decor, lighting, heating and care equipment for reptile keepers.", categories: ["reptile"], featured: false, website: "https://www.komodoproducts.com/" },
  { id: "brand-custom-1785541286163", name: "OutRider Reptile", slug: "outrider-reptile", logo: "/images/brands/outrider.webp", description: "Specialty lamps and protective lighting packaging for healthy reptiles.", categories: ["reptile"], featured: false, website: "https://outriderreptiles.com/" },

  // Bird Brands
  { id: "brand-bird-001", name: "Harrisons", slug: "harrisons", logo: "/images/brands/harissons.webp", description: "Certified organic, premium certified bird diets recommended by avian veterinarians.", categories: ["bird"], featured: true, website: "https://www.harrisonsbirdfoods.com" },
  { id: "brand-bird-002", name: "A&E", slug: "a-and-e", logo: "/images/brands/A&E.webp", description: "Quality bird cages, small pet habitats, and play stands.", categories: ["bird", "small-animal", "small-pet"], featured: true, website: "https://aecageco.com" },
  { id: "brand-bird-003", name: "ZuPreem", slug: "zupreem", logo: "/images/brands/zupreem.webp", description: "Nutritional pelleted diets and balanced foods for pet birds.", categories: ["bird"], featured: true, website: "https://zupreem.com" },
  { id: "brand-bird-004", name: "Volkman", slug: "volkman", logo: "/images/brands/volkman.webp", description: "Clean seed mixes and specialized nutrition for all pet bird species.", categories: ["bird"], featured: true, website: "https://volkmanseed.com" },
  { id: "brand-bird-005", name: "Lafeber's", slug: "lafebers", logo: "/images/brands/lafeber.svg", description: "Nutri-Berries and veterinarian-formulated avian nutrition.", categories: ["bird"], featured: true, website: "https://lafeber.com" },

  // Small Pet Brands
  { id: "brand-sm-001", name: "Oxbow", slug: "oxbow", logo: "/images/brands/Oxbow-Animal-Health-Logo.svg", description: "Premium hay, fortified foods, and care products for small herbivores.", categories: ["small-animal", "small-pet"], featured: true, website: "https://www.oxbowanimalhealth.com" },
  { id: "brand-sm-002", name: "Round Lake Farms", slug: "round-lake-farms", logo: "/images/brands/roundlakefarm.webp", description: "Fresh, high-quality farm hay for small pets.", categories: ["small-animal", "small-pet"], featured: true, website: "https://roundlakefarms.com" },
  { id: "brand-sm-003", name: "Kaytee", slug: "kaytee", logo: "/images/brands/kaytee-logo.png", description: "Trusted small pet bedding, nutrition, and enrichment treats.", categories: ["small-animal", "small-pet", "bird"], featured: true, website: "https://www.kaytee.com" },
  { id: "brand-sm-004", name: "Higgins", slug: "higgins", logo: "/images/brands/higgins.webp", description: "Natural seed blends, treats, and food for small animals and birds.", categories: ["small-animal", "small-pet", "bird"], featured: true, website: "https://www.higginspetfood.com" },

  // Aquatics Brands
  { id: "brand-aq-001", name: "AquaTop", slug: "aquatop", logo: "/images/brands/AQUATOP-red-logo-sm.webp", description: "Aquarium filtration, pumps, lighting, and aquatic equipment.", categories: ["aquatic"], featured: true, website: "https://www.aquatop.com" },
  { id: "brand-aq-002", name: "Ultum Nature Systems", slug: "ultum-nature-systems", logo: "/images/brands/unsystem.webp", description: "Premium rimless aquariums, aquascaping tools, and planted tank supplies.", categories: ["aquatic"], featured: true, website: "https://ultumnaturesystems.com" },
  { id: "brand-aq-003", name: "Seachem", slug: "seachem", logo: "/images/brands/seachem.webp", description: "Advanced water conditioners, plant fertilizers, and aquarium chemistry.", categories: ["aquatic"], featured: true, website: "https://www.seachem.com" },
  { id: "brand-aq-004", name: "Fluval Aquatics", slug: "fluval-aquatics", logo: "/images/brands/fluval.webp", description: "High-performance canister filters, LED lighting, and aquarium kits.", categories: ["aquatic"], featured: true, website: "https://fluvalaquatics.com" },
  { id: "brand-aq-005", name: "Aqueon", slug: "aqueon", logo: "/images/brands/aqueon_logo.webp", description: "Aquariums, filters, heaters, water treatments, and fish food.", categories: ["aquatic"], featured: true, website: "https://www.aqueon.com" },
  { id: "brand-aq-006", name: "CaribSea", slug: "caribsea", logo: "/images/brands/caribsea.webp", description: "Aragonite substrates, eco-complete planted tank substrate, and live sand.", categories: ["aquatic"], featured: true, website: "https://caribsea.com" },
  { id: "brand-aq-007", name: "Hikari", slug: "hikari", logo: "/images/brands/hikari.webp", description: "Species-specific fish food pellets, wafers, and freeze-dried diets.", categories: ["aquatic"], featured: true, website: "https://www.hikariusa.com" },
  { id: "brand-aq-008", name: "Hygger", slug: "hygger", logo: "/images/brands/hygger.webp", description: "Smart aquarium heaters, wavemakers, LED lights, and pumps.", categories: ["aquatic"], featured: true, website: "https://www.hygger-online.com" },
  { id: "brand-aq-009", name: "Sera", slug: "sera", logo: "/images/brands/sera.webp", description: "German-made aquarium foods, water conditioners, and treatments.", categories: ["aquatic"], featured: true, website: "https://www.sera.de" },
  { id: "brand-aq-010", name: "Tetra", slug: "tetra", logo: "/images/brands/tetra.webp", description: "TetraMin fish food flakes, Whisper filters, and water care.", categories: ["aquatic"], featured: true, website: "https://www.tetra-fish.com" },
  { id: "brand-aq-011", name: "API (Aquarium Pharm)", slug: "api-aquarium-pharm", logo: "/images/brands/api-logo_1.webp", description: "API Freshwater & Saltwater Master Test Kits, Stress Coat, and Quick Start.", categories: ["aquatic"], featured: true, website: "https://apifishcare.com" },
  { id: "brand-aq-012", name: "Fritz", slug: "fritz", logo: "/images/brands/fritz.webp", description: "FritzZyme nitrifying bacteria, water conditioners, and salt mixes.", categories: ["aquatic"], featured: true, website: "https://fritzaquatics.com" },
  { id: "brand-aq-013", name: "Red Sea", slug: "red-sea", logo: "/images/brands/redsea.webp", description: "REEFER reef systems, Coral Pro Salt, and reef care supplements.", categories: ["aquatic"], featured: true, website: "https://goredsea.com" },
  { id: "brand-aq-014", name: "AquaWorx", slug: "aquaworx", logo: "/images/brands/AquaWorx_Logo-PlayCoretag.webp", description: "Aquascaping LED lighting, tools, and nano aquarium equipment.", categories: ["aquatic"], featured: true, website: "https://aquaworx.com" },
];

async function sync() {
  fs.writeFileSync(path.resolve("data/brands.json"), JSON.stringify(allBrandsData, null, 2));
  console.log("Updated data/brands.json with real logo image paths.");

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const BrandSchema = new mongoose.Schema({
    id: String,
    name: String,
    slug: String,
    logo: String,
    description: String,
    categories: [String],
    featured: Boolean,
    website: String,
  }, { collection: "brands" });

  const BrandModel = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

  for (const b of allBrandsData) {
    await BrandModel.updateOne(
      { slug: b.slug },
      { $set: b },
      { upsert: true }
    );
  }

  console.log("Successfully updated all brand logos in MongoDB.");
  await mongoose.disconnect();
}

sync().catch(console.error);
