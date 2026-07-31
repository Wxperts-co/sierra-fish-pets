import { NextResponse } from "next/server";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

function getBaseCategorySlug(rawCatSlug: string): string {
  if (!rawCatSlug) return "";
  let base = rawCatSlug.trim().toLowerCase();
  if (base.includes("-/-")) {
    base = base.split("-/-")[0];
  }
  if (base === "fish" || base === "aquatics" || base === "aquatic") return "aquatic";
  if (base === "small-pet" || base === "small-pets" || base === "small-animal" || base === "small-animals") return "small-animal";
  if (base === "dogs" || base === "dog") return "dog";
  if (base === "cats" || base === "cat") return "cat";
  if (base === "birds" || base === "bird") return "bird";
  if (base === "reptiles" || base === "reptile") return "reptile";
  return base;
}

export async function GET() {
  try {
    await connectDB();

    const [rawCategories, rawSubcatSlugs, rawCategorySlugs, groupedCounts] = await Promise.all([
      Category.find({}).sort({ name: 1 }).lean(),
      Product.distinct("subcategorySlug", {
        subcategorySlug: { $ne: null, $nin: ["", "uncategorized"] },
      }),
      Product.distinct("categorySlug", { categorySlug: { $regex: /-\/-/ } }),
      Product.aggregate([
        {
          $group: {
            _id: "$categorySlug",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Build category product counts map
    const categoryCountMap = new Map<string, number>();
    (groupedCounts as { _id: string; count: number }[]).forEach((item) => {
      if (item._id) {
        const baseSlug = getBaseCategorySlug(item._id);
        const current = categoryCountMap.get(baseSlug) || 0;
        categoryCountMap.set(baseSlug, current + item.count);
      }
    });

    // Build normalized set of subcategory slugs that actually have products in DB
    const activeSubcatSet = new Set<string>();

    (rawSubcatSlugs as string[]).forEach((s) => {
      if (s) {
        const norm = String(s)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (norm) activeSubcatSet.add(norm);
      }
    });

    (rawCategorySlugs as string[]).forEach((s) => {
      if (s && s.includes("-/-")) {
        const sub = s.split("-/-")[1];
        if (sub) {
          const norm = String(sub)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          if (norm) activeSubcatSet.add(norm);
        }
      }
    });

    const categories = rawCategories.map((cat) => {
      const baseSlug = getBaseCategorySlug(cat.slug);
      const realCount = categoryCountMap.get(baseSlug) ?? cat.productCount ?? 0;

      return {
        ...cat,
        productCount: realCount,
        subcategories: (cat.subcategories || []).filter((sub: any) => {
          if (sub.isActive === false) return false;
          const normSubSlug = String(sub.slug || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          // Only include subcategories that have 1 or more products
          return activeSubcatSet.has(normSubSlug);
        }),
      };
    });

    categories.sort((a: any, b: any) => {
      const aIsOther = String(a.slug || "").includes("other") || String(a.name || "").toLowerCase().includes("other");
      const bIsOther = String(b.slug || "").includes("other") || String(b.name || "").toLowerCase().includes("other");
      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;
      return 0;
    });

    return NextResponse.json(
      { success: true, categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
