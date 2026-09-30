import { MetadataRoute } from "next";
import blogsData from "@/data/blogs.json";
import servicesData from "@/data/services.json";
import brandsData from "@/data/brands.json";
import sierraEduData from "@/data/sierraedu.json";
import { SERVICE_AREAS } from "@/data/serviceAreas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sierrafishandpets.com";

  // 1. Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/arrivals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sierra-edu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/customer-stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/event-calendar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/flyers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/coupons`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gift-cards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rewards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/special-order-animals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aquarium-philosophy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-aqua-jet-water-cleaning-system`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/dog-adoption`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // 2. Blog Posts Dynamic Routes
  const blogRoutes: MetadataRoute.Sitemap = blogsData
    .filter((post) => post.status !== "draft" && post.slug)
    .map((post) => {
      let lastModDate: Date;
      try {
        lastModDate = new Date(post.updatedAt || post.publishedAt || Date.now());
        if (isNaN(lastModDate.getTime())) {
          lastModDate = new Date();
        }
      } catch {
        lastModDate = new Date();
      }

      return {
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: lastModDate,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      };
    });

  // 3. Blog Category Routes
  const staticBlogCategories = ["dog", "cat", "bird", "aquatic", "small-animal", "reptile"];
  const dynamicBlogCategories = blogsData
    .map((p) => p.categorySlug)
    .filter((slug): slug is string => Boolean(slug) && slug !== "all");
  const blogCategorySlugs = Array.from(new Set([...staticBlogCategories, ...dynamicBlogCategories]));

  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategorySlugs.map((category) => ({
    url: `${baseUrl}/blogs/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // 4. Shop Category Routes
  const shopCategorySlugs = ["dog", "cat", "bird", "aquatic", "small-animal", "reptile"];
  const shopCategoryRoutes: MetadataRoute.Sitemap = shopCategorySlugs.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 5. Brands Detail & Category Routes
  const brandRoutes: MetadataRoute.Sitemap = brandsData
    .filter((b) => b.slug)
    .map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  const brandCategories = ["dog", "cat", "bird", "fish", "aquatic", "small-animal", "reptile"];
  const brandCategoryRoutes: MetadataRoute.Sitemap = brandCategories.map((cat) => ({
    url: `${baseUrl}/brands/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // 6. Arrivals Category Routes
  const arrivalCategories = [
    "all",
    "freshwater",
    "saltwater",
    "corals",
    "plants",
    "reptiles",
    "birds",
    "small-animals",
    "dogs",
    "cats",
  ];
  const arrivalCategoryRoutes: MetadataRoute.Sitemap = arrivalCategories.map((cat) => ({
    url: `${baseUrl}/arrivals/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 7. Education / Sierra Edu Guide Routes
  const educationRoutes: MetadataRoute.Sitemap = sierraEduData
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/education/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // 8. Gallery Category Routes
  const galleryCategories = ["store", "aquarium", "bird", "reptile", "dog", "cat"];
  const galleryCategoryRoutes: MetadataRoute.Sitemap = galleryCategories.map((cat) => ({
    url: `${baseUrl}/gallery/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // 9. In-store & Aquarium Services Routes
  const inStoreServices = servicesData
    .filter((s) => s.slug && s.category === "in-store")
    .map((s) => ({
      url: `${baseUrl}/services/in-store/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  const aquariumServices = servicesData
    .filter(
      (s) =>
        s.slug &&
        s.category === "aquarium" &&
        s.slug !== "about-aqua-jet-water-cleaning-system"
    )
    .map((s) => ({
      url: `${baseUrl}/services/aquarium/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  // 10. Service Areas Local Landing Pages
  const serviceAreaRoutes: MetadataRoute.Sitemap = [
    ...SERVICE_AREAS.map((area) => ({
      url: `${baseUrl}/service-areas/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  return [
    ...staticPages,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...shopCategoryRoutes,
    ...brandRoutes,
    ...brandCategoryRoutes,
    ...arrivalCategoryRoutes,
    ...educationRoutes,
    ...galleryCategoryRoutes,
    ...inStoreServices,
    ...aquariumServices,
    ...serviceAreaRoutes,
  ];
}
