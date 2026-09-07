import { MetadataRoute } from "next";
import blogsData from "@/data/blogs.json";
import servicesData from "@/data/services.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sierrafishandpets.com";

  // Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/arrivals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sierra-edu`,
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
      url: `${baseUrl}/special-order-animals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/event-calendar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/flyers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/coupons`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gift-cards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/rewards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
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

  // Blog Posts Dynamic Routes
  const blogRoutes: MetadataRoute.Sitemap = blogsData.map((post) => {
    const lastMod = post.updatedAt || post.publishedAt || new Date().toISOString();
    return {
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: new Date(lastMod),
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  // Blog Category Routes
  const blogCategorySlugs = ["dog", "cat", "bird", "aquatic", "small-animal", "reptile"];
  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategorySlugs.map((category) => ({
    url: `${baseUrl}/blogs/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Shop Category Routes
  const shopCategorySlugs = ["dog", "cat", "bird", "aquatic", "small-animal", "reptile"];
  const shopCategoryRoutes: MetadataRoute.Sitemap = shopCategorySlugs.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // In-store Services Routes
  const serviceRoutes: MetadataRoute.Sitemap = servicesData
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${baseUrl}/services/in-store/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...shopCategoryRoutes,
    ...serviceRoutes,
  ];
}
