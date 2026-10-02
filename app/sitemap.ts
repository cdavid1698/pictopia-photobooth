import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/packages", "/pause-time", "/book", "/faq", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/book" ? 0.9 : 0.6,
  }));
}
