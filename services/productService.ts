import dogProducts from "@/data/products/dog.json";
import catProducts from "@/data/products/cat.json";
import aquaticProducts from "@/data/products/aquatic.json";
import birdProducts from "@/data/products/bird.json";
import reptileProducts from "@/data/products/reptile.json";
import smallAnimalProducts from "@/data/products/small-animal.json";

export const getAllProducts = () => [
  ...dogProducts,
  ...catProducts,
  ...aquaticProducts,
  ...birdProducts,
  ...reptileProducts,
  ...smallAnimalProducts,
];

export const getProductById = (id: string) =>
  getAllProducts().find(
    (product) => product.id === id
  );