import type { MetadataRoute } from "next";
import { projectPages, projectPath } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...projectPages.map((p) => ({ url: `${site.url}${projectPath(p.id)}`, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
