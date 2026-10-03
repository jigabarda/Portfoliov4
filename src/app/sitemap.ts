import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Single-page site: the home page is the only URL to index.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
